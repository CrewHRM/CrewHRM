<?php
/**
 * Application comment handler
 *
 * @package crewhrm
 */

namespace CrewHRM\Models;

use CrewHRM\Helpers\_Array;

/**
 * Comment manager class
 */
class Comment {
	/**
	 * Create or update comment
	 *
	 * @param array $comment The comment array to create or update
	 * @return int
	 */
	public static function createUpdateComment( array $comment ) {
		$_comment = array(
			'application_id'  => $comment['application_id'],
			'comment_content' => $comment['comment_content'] ?? '',
			'commenter_id'    => $comment['commenter_id'] ?? get_current_user_id(),
			'comment_date'    => gmdate( 'Y-m-d H:i:s' ),
		);

		$comment_id = $comment['comment_id'] ?? null;

		global $wpdb;
		if ( ! empty( $comment_id ) ) {
			// Update comment
			$wpdb->update(
				DB::comments(),
				$_comment,
				array( 'comment_id' => $comment_id )
			);

		} else {
			// Create comment
			$wpdb->insert(
				DB::comments(),
				$_comment
			);

			$comment_id = $wpdb->insert_id;
		}

		return $comment_id;
	}

	/**
	 * Get application comments
	 *
	 * @param int $application_id The application ID to get comments of
	 * @return array
	 */
	public static function getComments( $application_id ) {
		global $wpdb;
		$comments = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT 
					_comment.*, 
					_user.display_name AS commenter_name, 
					UNIX_TIMESTAMP(_comment.comment_date) AS timestamp 
				FROM ' . DB::comments() . " _comment
					LEFT JOIN {$wpdb->users} _user on _comment.commenter_id=_user.ID
				WHERE _comment.application_id=%d AND _comment.comment_parent_id IS NULL",
				$application_id
			),
			ARRAY_A
		);

		return _Array::castRecursive( $comments );
	}
}
