<?php
/**
 * Application related business logics
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;
use CrewHRM\Helpers\_String;
use CrewHRM\Helpers\File;

/**
 * The model class for application functionalities
 */
class Application {
	/**
	 * Create an application
	 * ---------------------
	 *
	 * @param array $application Textual application data
	 * @return bool
	 */
	public static function createApplication( array $application ) {
		global $wpdb;

		// Create address first to insert the id in application row
		$address_id = Address::createUpdateAddress( $application );

		$_application = array(
			'job_id'           => $application['job_id'],
			'address_id'       => $address_id,
			'stage_id'         => null, // Initially no stage.
			'first_name'       => $application['first_name'] ?? '',
			'last_name'        => $application['last_name'] ?? '',
			'email'            => $application['email'] ?? '',
			'phone'            => $application['phone'] ?? '',
			'gender'           => $application['gender'] ?? null,
			'date_of_birth'    => $application['date_of_birth'] ?? null,
			'cover_letter'     => $application['cover_letter'] ?? null,
			'resume_file_id'   => null, // It will be saved in separate request
			'application_date' => gmdate( 'Y-m-d H:i:s' ),
		);

		// Insert the main job data
		$wpdb->insert(
			DB::applications(),
			$_application
		);
		$app_id = $wpdb->insert_id;
		if ( empty( $app_id ) ) {
			return;
		}

		/**
		 * Action hook that runs after job application created.
		 *
		 * @param int   $app_id       Newly created application ID.
		 * @param array $_application Prepared application data array that was inserted into database.
		 * @param array $application  Raw array that was sent to application creator method.
		 */
		do_action( 'crewhrm_job_application_created', $app_id, $_application, $application );

		return $app_id;
	}

	/**
	 * Save job application files
	 *
	 * @param int    $application_id The application ID to store files for
	 * @param string $field_name     The field name to upload for
	 * @param array  $file           Uploaded file
	 * @return void
	 */
	public static function uploadApplicationFile( $application_id, $field_name, $file ) {

		// Insert resume
		if ( 'resume' === $field_name ) {
			$resume_id = FileManager::uploadFile( $application_id, $file, 'Resume-' . $application_id . '-' . _String::getRandomString() );
			if ( ! empty( $resume_id ) ) {
				global $wpdb;
				$wpdb->update(
					DB::applications(),
					array( 'resume_file_id' => $resume_id ),
					array( 'application_id' => $application_id )
				);
			}
		}

		do_action( 'crewhrm_upload_application_file', $application_id, $field_name, $file );
	}

	/**
	 * Delete job applications by job ID
	 *
	 * @param int $job_id Job ID
	 * @return void
	 */
	public static function deleteApplicationByJobId( $job_id ) {
		$app_ids = self::getApplicationsIdsByJobId( $job_id );
		self::deleteApplication( $app_ids );
	}

	/**
	 * Delete job by ID
	 *
	 * @param int|array $application_id Application ID or array of IDs
	 * @return void
	 */
	public static function deleteApplication( $application_id ) {
		global $wpdb;

		$ids          = is_array( $application_id ) ? $application_id : array( $application_id );
		$ids_in       = implode( ',', $ids );
		$applications = $wpdb->get_results(
			'SELECT application_id, resume_file_id, address_id FROM ' . DB::applications() . " 
			WHERE application_id IN ({$ids_in})",
			ARRAY_A
		);
		$applications = _Array::indexify( _Array::castRecursive( $applications ), 'application_id' );

		// Delete associated address
		$address_ids = array_filter( array_column( $applications, 'address_id' ) );
		Address::deleteAddress( $address_ids );

		// Colelct resume and attachment ids to delete together
		$_applications  = Meta::application( null )->assignBulkMeta( $applications, 'application_attachments' );
		$attachment_ids = array_map(
			function( $app ) {
				$attachments = _Array::getArray( $app['meta']->application_attachments ?? array() );
				return array_filter(
					$attachments,
					function( $id ) {
						return is_numeric( $id );
					}
				);
			},
			$_applications
		);
		$attachment_ids = _Array::flattenArray( $attachment_ids );

		// Add resume IDs into the array
		$resume_file_ids = array_filter(
			array_column(
				$applications,
				'resume_file_id'
			)
		);
		$attachment_ids  = array_unique( array_filter( array_merge( $attachment_ids, $resume_file_ids ) ) );

		// Now delete all the files together
		File::deleteFile( $attachment_ids, true );

		// Delete Attachments meta
		Meta::application( null )->deleteBulkMeta( $ids );

		// Delete pipelines
		$wpdb->query(
			'DELETE FROM ' . DB::pipeline() . " WHERE application_id IN({$ids_in})"
		);

		// Delete application finally
		$wpdb->query(
			'DELETE FROM ' . DB::applications() . " WHERE application_id IN({$ids_in})"
		);

		// Execute hook to delete more pro dependencies
		do_action( 'crewhrm_job_applications_deleted', $ids );
	}

	/**
	 * Get application ids of a job post
	 *
	 * @param int $job_id Job ID
	 * @return array
	 */
	public static function getApplicationsIdsByJobId( $job_id ) {
		global $wpdb;

		return $wpdb->get_col(
			$wpdb->prepare(
				'SELECT application_id FROM ' . DB::applications() . ' WHERE job_id=%d',
				$job_id
			)
		);
	}

	/**
	 * Get total count of applications per stages.
	 *
	 * @param array $jobs Jobs Array to append application counts
	 * @return array
	 */
	public static function appendApplicationCounts( $jobs ) {
		// Prepare the jobs array
		$jobs    = _Array::appendColumn(
			$jobs,
			'stats',
			array(
				'candidates' => 0,
				'stages'     => array(),
			)
		);
		$job_ids = array_column( $jobs, 'job_id' );

		// Get stats
		$stats      = Stage::getStageStatsByJobId( $job_ids );
		$candidates = $stats['candidates'] ?? 0;
		$stages     = $stats['stages'] ?? array();

		// Loop through total candidate counts per job regardless of stage
		foreach ( $candidates as $job_id => $total ) {

			// Assign the total candidate count per job
			$jobs[ $job_id ]['stats']['candidates'] = $total;

			// Loop thorugh the stages under the job
			foreach ( $stages[ $job_id ] as $stage ) {
				$jobs[ $job_id ]['stats']['stages'][ $stage['stage_id'] ] = $stage;
			}
		}

		return $jobs;
	}

	/**
	 * Get application list by args.
	 * Disqualified stage will never be added to the application table directly.
	 * Rather it will be in the pipeline table and use SQL to determine.
	 *
	 * Incomplete applications will be excluded from the query.
	 * Incomplete means file uploading not completed after clicking submit.
	 * Maybe still in progress, or disconnected or closed window/tab.
	 *
	 * @param array $args Application args
	 * @param bool  $count_only Whether to return only count instead of data
	 * @return array
	 */
	public static function getApplications( array $args, $count_only = false ) {
		global $wpdb;

		// Prepare arguments
		$job_id        = $args['job_id'];
		$stage_id      = $args['stage_id'] ?? null;
		$disq_stage_id = Stage::getDisqualifyId( $job_id );
		$get_qualified = 'disqualified' !== ( $args['qualification'] ?? 'qualified' );

		// Prepare limitters
		$where_clause = "app.job_id={$job_id} AND app.is_complete=1";

		// Assign search query
		if ( ! empty( $args['search'] ) ) {
			$keyowrd       = esc_sql( $args['search'] );
			$where_clause .= " AND (app.first_name LIKE '%{$keyowrd}%' OR app.last_name LIKE '%{$keyowrd}%')";
		}

		// Apply specific stage filter
		if ( ! empty( $stage_id ) ) {
			$where_clause .= " AND app.stage_id={$stage_id}";
		}

		$disq_ids = $wpdb->get_col(
			'WITH RankedData AS (
				SELECT
					application_id,
					stage_id,
					action_date,
					ROW_NUMBER() OVER (PARTITION BY application_id ORDER BY action_date DESC) AS rn
				FROM ' . DB::pipeline() . "
			)
			SELECT application_id
			FROM RankedData
			WHERE stage_id={$disq_stage_id} AND rn = 1;"
		);
		array_unshift( $disq_ids, 0 );
		$ids_implode = implode( ',', $disq_ids );

		$operator      = $get_qualified ? 'NOT IN' : 'IN';
		$where_clause .= " AND app.application_id {$operator} ({$ids_implode})";

		// Run query and get the application IDs
		$application_ids = $wpdb->get_col(
			'SELECT app.application_id 
			FROM ' . DB::applications() . ' app
				LEFT JOIN ' . DB::stages() . " stage ON app.stage_id=stage.stage_id 
			WHERE {$where_clause} ORDER BY application_date DESC"
		);

		if ( $count_only ) {
			return count( $application_ids );
		}

		if ( empty( $application_ids ) ) {
			return array();
		}

		// Get data now by the IDs as it's complicated to get all together
		$application_ids = _Array::castRecursive( $application_ids );
		$ids_in          = implode( ',', $application_ids );
		$results         = $wpdb->get_results(
			'SELECT 
				application_id,
				job_id,
				stage_id,
				address_id,
				first_name,
				last_name,
				email,
				phone,
				date_of_birth,
				gender,
				cover_letter,
				resume_file_id,
				is_complete, 
				UNIX_TIMESTAMP(application_date) AS application_date 
			FROM ' . DB::applications() . " WHERE application_id IN ({$ids_in}) ORDER BY application_date DESC",
			ARRAY_A
		);

		return _Array::castRecursive( $results );
	}

	/**
	 * Get singel application, ideally for single application profile view by admin/editor.
	 *
	 * @param int $job_id         Job ID
	 * @param int $application_id Application ID
	 * @return array
	 */
	public static function getSingleApplication( $job_id, $application_id ) {

		global $wpdb;
		$application = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . DB::applications() . ' WHERE job_id=%d AND application_id=%d',
				$job_id,
				$application_id
			),
			ARRAY_A
		);

		if ( empty( $application ) ) {
			return null;
		}

		// Cast
		$application = _Array::castRecursive( $application );

		// Assign resume file url
		$application['resume_file_url'] = is_numeric( $application['resume_file_id'] ) ? File::getRestrictedFileURL( $application['resume_file_id'] ) : null;

		// Assign address
		$application['address'] = is_numeric( $application['address_id'] ) ? Address::getAddressById( $application['address_id'] ) : null;

		// Set overview
		$application['overview'] = apply_filters( 'crewhrm_application_overview', array(), $application_id, $job_id );

		// Set documents
		$application['documents'] = self::getApplicationDocuments( $application_id, $job_id );

		// Set if disqualified
		$application['disqualified'] = self::isDisqualified( $application_id );

		return $application;
	}

	/**
	 * Check if an application disqualified
	 *
	 * @param int $application_id Application ID
	 * @return boolean
	 */
	public static function isDisqualified( $application_id ) {
		global $wpdb;
		$stage_name = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT stage.stage_name FROM ' . DB::pipeline() . ' pipe
					INNER JOIN ' . DB::applications() . ' app ON pipe.application_id=app.application_id
					INNER JOIN ' . DB::stages() . ' stage ON pipe.stage_id=stage.stage_id
				WHERE app.application_id=%d ORDER BY pipe.action_date DESC LIMIT 1',
				$application_id
			)
		);

		return '_disqualified_' === $stage_name;
	}

	/**
	 * Prepare documents to show in single application view in dashboard
	 *
	 * @param int $application_id Application ID
	 * @return array
	 */
	public static function getApplicationDocuments( $application_id ) {
		$documents = array();

		// Get resume
		$resume_id               = Field::applications()->getField( array( 'application_id' => $application_id ), 'resume_file_id' );
		$documents['resume_url'] = ! empty( $resume_id ) ? File::getRestrictedFileURL( $resume_id ) : null;

		// Get attachments
		$documents['attachments'] = array();
		$attachment_ids           = Meta::application( $application_id )->getMeta( 'application_attachments' );
		$attachment_ids           = _Array::getArray( $attachment_ids );
		foreach ( $attachment_ids as $id ) {
			$documents['attachments'][] = array(
				'file_id'   => $id,
				'file_url'  => File::getRestrictedFileURL( $id ),
				'file_name' => get_the_title( $id ),
				'mime_type' => get_post_mime_type( $id ),
			);
		}

		return $documents;
	}

	/**
	 * Change application stage
	 *
	 * @param int        $job_id         Job ID
	 * @param int        $application_id Application ID
	 * @param int|string $stage_id Stage ID (or _disqualify_ only in case of disqualification, from single application view)
	 * @return bool
	 */
	public static function changeApplicationStage( $job_id, $application_id, $stage_id ) {

		// Determine whether to disqualify the application
		$is_disqualify = '_disqualified_' === $stage_id;
		$old_stage_id  = Stage::getCurrentStageIdByApplicationId( $application_id );

		if ( $is_disqualify ) {
			// If it is to disqualify, get the numeric ID of the disqualification stage.
			$stage_id = Stage::getDisqualifyId( $job_id );
		} else {
			// If not to disqualify explicitly, then check if the stage ID refers to disqualify either way.
			// And set them that way.
			$disqname      = Field::stages()->getField(
				array(
					'job_id'   => $job_id,
					'stage_id' => $stage_id,
				),
				'stage_name'
			);
			$is_disqualify = '_disqualified_' === $disqname;
		}

		global $wpdb;

		if ( ! $is_disqualify ) {
			// Disqualify stage should not be assigned application table directly because of classification of qualified/disqualified per stages.
			// Rather use only the pipeline to determine disqualified state.
			$wpdb->update(
				DB::applications(),
				array( 'stage_id' => $stage_id ),
				array(
					'application_id' => $application_id,
					'job_id'         => $job_id,
				)
			);
		}

		// Now insert an entry to the pipeline
		Pipeline::create( $application_id, $stage_id, get_current_user_id() );

		do_action( 'crewhrm_application_stage_changed', $application_id, $stage_id, $old_stage_id, $job_id );

		return true;
	}

	/**
	 * Get application overview of total site
	 *
	 * @return array
	 */
	public static function getApplicationStats() {
		global $wpdb;

		// Total created job no matter status or anything
		$total_job = $wpdb->get_var(
			'SELECT COUNT(job_id) FROM ' . DB::jobs()
		);

		// Total application count no matter the stage
		$total_application = $wpdb->get_var(
			'SELECT COUNT(application_id) FROM ' . DB::applications()
		);

		$total_hired = $wpdb->get_var(
			'SELECT COUNT(app.application_id) 
			FROM ' . DB::applications() . ' app
				INNER JOIN ' . DB::stages() . " stage ON app.stage_id=stage.stage_id
			WHERE stage.stage_name='_hired_';"
		);

		$total_pending = $wpdb->get_var(
			'SELECT COUNT(application_id) FROM ' . DB::applications() . ' WHERE stage_id IS NULL'
		);

		return _Array::castRecursive(
			array(
				'total_jobs'                 => $total_job,
				'total_applications'         => $total_application,
				'total_pending_applications' => $total_pending,
				'total_hired'                => $total_hired,
			)
		);
	}
}
