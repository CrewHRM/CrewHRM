<?php

namespace CrewHRM\Models;

class Comment {
	/**
	 * Create or update comment
	 *
	 * @param array $comment
	 * @return void
	 */
	public static function createUpdateComment( array $comment ) {
		$_comment = array(
			'application_id'  => $comment['application_id'],
			'comment_content' => $comment['comment_content'] ?? '',
			'commenter_id'    => $comment['commenter_id'] ?? get_current_user_id()
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
}