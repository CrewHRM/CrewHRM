<?php

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

class Application {
	/**
	 * Create an application
	 *
	 * @param array $application
	 * @return bool
	 */
	public static function createApplication( array $application ) {
		global $wpdb;

		// Create address first to insert the id in application row
		$address_id = Address::createUpdateAddress( $application );

		$_application = array(
			'job_id'         => $application['job_id'],
			'address_id'     => $address_id,
			'stage_id'       => null, // Initially no stage.
			'first_name'     => $application['first_name'] ?? '',
			'last_name'      => $application['last_name'] ?? '',
			'email'          => $application['email'] ?? '',
			'phone'          => $application['phone'] ?? '',
			'gender'         => $application['phone'] ?? null,
			'date_of_birth'  => $application['date_of_birth'] ?? null,
			'cover_letter'   => $application['cover_letter'] ?? null,
			'resume_file_id' => 0,
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

		// Insert custom added questions
		foreach ( $application as $key => $value ) {
			if ( strpos( $key, '_question_' ) === 0 ) {
				// To Do: Process data based on question type. Like upload file and assign file ID instead as value
				Meta::application()->updateMeta( $app_id, $key, $value );
			}
		}
		
		return $app_id;
	}

	/**
	 * Delete job applications by job ID
	 *
	 * @param [type] $job_id
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

		$ids         = is_array( $application_id ) ? $application_id : array( $application_id );
		$ids_in      = implode( ',', $ids );
		$address_ids = $wpdb->get_col( "SELECT address_id FROM " . DB::applications() . " WHERE application_id IN ({$ids_in}) AND address_id>0" );

		// Delete associated address
		Address::deleteAddress( $address_ids );

		// Delete resume

		// Delete attachments

		// Delete pipelines
		$wpdb->query(
			"DELETE FROM " . DB::pipeline() . " WHERE application_id IN({$ids_in})"
		);

		// Delete application finally
		$wpdb->query(
			"DELETE FROM " . DB::applications() . " WHERE application_id IN({$ids_in})"
		);
	}

	/**
	 * Get application ids of a job post
	 *
	 * @param int $job_id
	 * @return array
	 */
	public static function getApplicationsIdsByJobId( $job_id ) {
		global $wpdb;

		return $wpdb->get_col(
			$wpdb->prepare(
				"SELECT application_id FROM " . DB::applications() . " WHERE job_id=%d",
				$job_id
			)
		);
	}

	/**
	 * Get total count of applications per stages.
	 *
	 * @param array $jobs
	 * @return array
	 */
	public static function appendApplicantCounts( array $jobs ) {
		// Prepare the jobs array
		$jobs    = _Array::appendArray( $jobs, 'stats', array( 'candidates' => 0, 'stages' => array() ) );
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
	 * Get applicant list by args.
	 * Disqualified stage will never be added to the application table directly. 
	 * Rather it will be in the pipeline table and use SQL to determine. 
	 *
	 * @param array $args
	 * @return array
	 */
	public static function getApplicants( array $args ) {
		global $wpdb;

		// Prepare arguments
		$job_id         = $args['job_id'];
		$stage_id       = $args['stage_id'] ?? null;
		$disq_stage_id  = Stage::getDisqualifyId( $job_id );
		$get_qualified  = $args['qualification'] !== 'disqualified';

		// Prepare limitters
		$limit         = $args['limit'] ?? 20;
		$offset        = ( ( $args['page'] ?? 1 ) - 1 ) * $limit;
		$limit_clause  = " LIMIT {$limit} OFFSET {$offset}";
		$where_clause  = "app.job_id={$job_id}";

		// Assign search query
		if ( ! empty( $args['search'] ) ) {
			$keyowrd = esc_sql( $args['search'] );
			$where_clause .= " AND (app.first_name LIKE '%{$keyowrd}%' OR app.last_name LIKE '%{$keyowrd}%')";
		}
		
		// If it needs applications of specific stage
		if ( ! empty( $stage_id ) ) {
			$stage_sequence = Stage::getField( $stage_id, 'sequence' );
			$where_clause .= " AND app.stage_id={$stage_id}";

			// As it is specifc stage, so get qualified and disqualified applications of this stage
			if ( $get_qualified ) {
				$where_clause .= " AND (stage.sequence>{$stage_sequence} OR (stage.sequence={$stage_sequence} AND pipe.stage_id!={$disq_stage_id}))";

			} else {
				// Disqualified filter
				$where_clause .= " AND (stage.sequence<={$stage_sequence} AND pipe.stage_id={$disq_stage_id})";
			}

		} else {
			// Stage data empty means get all candidates stats regardless of stage
			if ( $get_qualified ) {
				$where_clause .= " AND pipe.stage_id!={$disq_stage_id}";
			} else {
				$where_clause .= " AND pipe.stage_id={$disq_stage_id}";
			}
		}

		// Run query and get the application IDs
		$application_ids = $wpdb->get_col(
			"SELECT DISTINCT pipe.application_id FROM " . DB::applications() . " app
				LEFT JOIN " . DB::stages() . " stage ON app.stage_id=stage.stage_id
				LEFT JOIN " . DB::pipeline() . " pipe ON app.application_id=pipe.application_id 
			WHERE 
				{$where_clause}
				GROUP BY pipe.application_id ORDER BY pipe.application_id DESC {$limit_clause}"
		);
		if ( empty( $application_ids ) ) {
			return array();
		}

		// Get data now by the IDs as it's complicated to get all together
		$application_ids = _Array::castRecursive( $application_ids );
		$ids_in          = implode( ',', $application_ids );
		$results         = $wpdb->get_results(
			"SELECT * FROM " . DB::applications() . " WHERE application_id IN ({$ids_in})"
		);

		return _Array::castRecursive( $results );
	}

	/**
	 * Get singel applicant, ideally for single applicant profile view by admin/editor.
	 *
	 * @param int $application_id
	 * @param int $job_id
	 * @return array
	 */
	public static function getSingleApplicant( $job_id, $application_id ) {
		
		global $wpdb;
		$applicant = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM " . DB::applications() . " WHERE job_id=%d AND application_id=%d",
				$job_id,
				$application_id
			),
			ARRAY_A
		);

		// Cast 
		$applicant = _Array::castRecursive( $applicant );

		// Assign resume file url
		$applicant['resume_file_url'] = is_numeric( $applicant['resume_file_id'] ) ? wp_get_attachment_url( $applicant['resume_file_id'] ) : null;

		// Assign address
		$applicant['address'] = is_numeric( $applicant['address_id'] ) ? Address::getAddressById( $applicant['address_id'] ) : null;

		// Set overview
		$applicant['overview'] = self::getApplicationOverview( $application_id, $job_id );

		// Set documents
		$applicant['documents'] = self::getApplicationDocuments( $application_id, $job_id );
		
		return $applicant;
	}

	/**
	 * Prepare application overview for single applicant view
	 *
	 * @param int $application_id
	 * @return array
	 */
	public static function getApplicationOverview( $application_id, $job_id ) {
		$overview = array();
		$meta     = Meta::application()->getMeta( $application_id );
		$form     = Job::getFiled( $job_id, 'application_form' );
		
		// Loop through all the meta data of the application
		foreach ( $meta as $meta_key => $meta_value ) {
	
			// Loop through all the application form sections such as personal, documents, profile and questions.
			foreach ( $form as $section ) {

				// Loop thorugh all the fields under the section to identify which meta is for which field
				foreach ( $section['fields'] as $field ) {

					// Gather field data like id, label, and options (if it is multiple checkbox type)
					$id            = $field['id'];
					$label         = $field['label'];
					$field_options = $field['field_options'] ?? array();

					// Make sure to use appropriate questionaire only
					if ( $meta_key !== $id || ! ( strpos( $id, '_question__' ) === 0 ) ) {
						continue;
					}

					switch( $field['type'] ) {
						case 'file' :
							break;
						
						// Pick option label from the application form settings
						case 'checkbox' :
							$overview[] = array(
								'id'           => $id,
								'label'        => $label,
								'text_options' => array_filter(
									array_map(
										function( $value_id ) use( $field_options ) {
											return _Array::find( $field_options, 'id', $value_id );
										},
										$meta_value
									)
								)
							);
							break;

						// As it is normal text based answer, just add to overview. 
						// Even values from dropdown and radio button are also applicable here as those are single value ultimately unlike multi checkbox or file.
						default :
							$overview[] = array(
								'id'    => $id,
								'label' => $label,
								'text'  => $meta_value,
							);
					}
				}
			}
		}
		
		return _Array::castRecursive( $overview );
	}

	/**
	 * Prepare documents to show in single applicant view in dashboard
	 *
	 * @param int $application_id
	 * @return array
	 */
	public static function getApplicationDocuments( $application_id ) {
		$documents = array();

		return $documents;
	}

	/**
	 * Prepare application activities/pipeline to show in single applicant view in dashboard
	 *
	 * @param int $application_id
	 * @return array
	 */
	public static function getApplicationPipeline( $application_id ) {
		$pipeline = array();

		return $pipeline;
	}
}
