<?php

namespace CrewHRM\Setup;

use CrewHRM\Models\FileManager;

class Media {
	public function __construct() {
		add_action( 'pre_get_posts', array( $this, 'hideApplicationMedia' ) );
	}

	/**
	 * Hide application resume and attachments from media picker view.
	 *
	 * @param object $query
	 * @return void
	 */
	public function hideApplicationMedia( $query ) {
		// Only modify the query for media contents
		if ( is_admin() && $query->query['post_type'] == 'attachment' ) {
			$meta_query = $query->get('meta_query');
			if ( ! is_array( $meta_query ) ) {
				$meta_query = array();
			}
			
			$meta_query[] = array(
				'key'     => FileManager::$crewhrm_meta_key,
				'compare' => 'NOT EXISTS', // Hide release media contents
			);

			$query->set('meta_query', $meta_query);
		}
	}
}