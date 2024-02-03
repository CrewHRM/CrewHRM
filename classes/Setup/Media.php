<?php
/**
 * Media manager
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Models\FileManager;
use CrewHRM\Models\User;

/**
 * Hide application files from WP media picker
 */
class Media {

	/**
	 * Set up media related hooks
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'pre_get_posts', array( $this, 'hideApplicationMedia' ) );
	}

	/**
	 * Hide application resume and attachments from media picker view.
	 *
	 * @param object $query The query to modify to hide application files from media
	 * @return void
	 */
	public function hideApplicationMedia( $query ) {
		// Only modify the query for media contents
		if ( is_admin() && 'attachment' === $query->query['post_type'] ) {
			$meta_query = $query->get( 'meta_query' );
			if ( ! is_array( $meta_query ) ) {
				$meta_query = array();
			}

			$meta_query[] = array(
				'key'     => FileManager::$crewhrm_meta_key,
				'compare' => 'NOT EXISTS', // Hide release media contents
			);

			$meta_query[] = array(
				'key'     => User::META_KEY_AVATAR_CREW_FLAG,
				'compare' => 'NOT EXISTS', // Hide employee avatars from media window
			);

			$query->set( 'meta_query', $meta_query );
		}
	}
}
