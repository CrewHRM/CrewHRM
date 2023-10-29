<?php
/**
 * Admin page setup
 *
 * @package crewhrm
 */

namespace CrewHRM\Setup;

use CrewHRM\Helpers\Utilities;
use CrewHRM\Main;
use CrewHRM\Models\Application;
use CrewHRM\Models\Department;
use CrewHRM\Models\Settings;
use CrewHRM\Models\User;

/**
 * The setup class
 */
class Admin {
	const SLUG_SETTINGS        = 'crewhrm-settings';
	const MOUNTPOINT_SETTINGS  = 'crewhrm_settings';
	const MOUNTPOINT_DASHBOARD = 'crewhrm_dashboard';
	const PAGE_SLUG_CALENDAR   = 'crewhrm-event-calendar';

	/**
	 * Setup admin menus
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'registerMenu' ), 10 );
		add_action( 'admin_menu', array( $this, 'registerCalendar' ), 10 );
		add_filter( 'plugin_action_links_' . plugin_basename( Main::$configs->file ), array( $this, 'pluginActionLinks' ) );
		add_action( 'admin_notices', array( $this, 'showCareersPageError' ) );
	}

	/**
	 * Register calendar promotion
	 *
	 * @return void
	 */
	public function registerCalendar() {
		
		// Do not register if pro plugin is active
		if ( Main::$configs->has_pro ) {
			return;
		}

		// Setting page
		add_submenu_page(
			Main::$configs->app_name,
			__( 'Event Calendar', 'crewhrm' ),
			__( 'Event Calendar', 'crewhrm' ),
			User::getAdminMenuRole( get_current_user_id() ),
			self::PAGE_SLUG_CALENDAR, // The slug must be same as the pro one, so the url will remain same.
			array( $this, 'calendarPage' )
		);
	}

	/**
	 * Contents for the addons page
	 */
	public function calendarPage() {
		echo '<div id="crewhrm_event_calendar_page_promotion"></div>';
	}

	/**
	 * Register admin menu pages
	 *
	 * @return void
	 */
	public function registerMenu() {
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$logo = 'data:image/svg+xml;base64,' . base64_encode(
			'<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M186.944 170.714C179.052 183.808 167.931 192.955 153.94 198.157C143.357 202.103 132.416 203.717 121.295 202.641C106.587 201.206 93.4935 195.108 82.5521 184.525C73.0456 175.019 67.1265 163.36 64.7948 149.907C61.9249 133.764 63.7186 118.159 71.252 103.81C77.7092 91.2544 87.2156 82.2861 99.5919 76.367C108.202 72.2415 117.17 70.2685 126.497 70.0891C127.753 70.0891 130.084 69.9097 130.443 68.6542C132.775 62.3763 134.389 56.4572 138.156 50.8968C138.694 50.1794 139.411 50 140.129 50.1794L156.81 56.2779C157.886 56.6366 158.245 58.0715 157.707 58.9684C154.837 63.4525 142.281 72.0621 147.662 72.6002C151.429 72.959 153.402 73.6764 155.196 74.2145C164.164 77.0844 172.056 81.5686 178.693 88.5639C184.074 94.483 187.482 101.299 187.482 109.55C187.482 122.285 179.769 131.612 167.931 133.944C149.456 137.531 133.672 127.128 127.394 107.936C125.78 102.734 124.703 97.3529 124.524 91.9719C124.524 91.4338 124.345 91.075 124.345 90.5369C120.399 90.7163 116.811 91.4338 113.224 92.8687C100.309 97.7116 91.6998 107.218 87.7537 120.85C83.4489 135.379 84.8839 149.549 92.5966 162.642C98.6951 173.046 107.484 179.862 118.964 181.835C135.824 184.705 151.07 180.579 163.267 167.306M144.972 93.4068C142.819 94.3036 146.407 104.886 149.994 109.729C152.146 112.778 155.196 114.572 158.783 114.931C162.55 115.29 165.24 113.317 165.958 109.729C166.496 106.859 165.42 104.528 163.626 102.375C160.397 98.6085 156.093 96.456 151.788 94.483C151.967 94.6624 146.586 92.6893 144.972 93.4068Z" fill="#9DA2A8"/>
			</svg>
		'
		);

		$white_label = Utilities::getWhiteLabel();
		if ( ! empty( $white_label['app_logo'] ) ) {
			add_action(
				'admin_head',
				function() use($white_label){
					?>
					<style>
						.toplevel_page_crewhrm .wp-menu-image.svg {
							background-image: url(<?php echo $white_label['app_logo']; ?>) !important;
						}
					</style>
					<?php
				}
			);
		}

		// Main page
		add_menu_page(
			__( $white_label['app_label'], 'crewhrm' ),
			__( $white_label['app_label'], 'crewhrm' ),
			User::getAdminMenuRole( get_current_user_id() ),
			Main::$configs->app_name,
			array( $this, 'mainPage' ),
			$logo
		);

		// Setting page
		add_submenu_page(
			Main::$configs->app_name,
			__( 'Settings', 'crewhrm' ),
			__( 'Settings', 'crewhrm' ),
			User::getAdminMenuRole( get_current_user_id() ),
			self::SLUG_SETTINGS,
			array( $this, 'settingPage' )
		);
	}

	/**
	 * Main page content
	 *
	 * @return void
	 */
	public function mainPage() {
		$application_overview = Application::getApplicationStats();
		echo '<div 
				id="' . esc_attr( self::MOUNTPOINT_DASHBOARD ) . '" 
				data-departments="' . esc_attr( wp_json_encode( Department::getDepartments() ) ) . '"
				data-application-stats="' . esc_attr( wp_json_encode( $application_overview ) ) . '"></div>';
	}

	/**
	 * Setting page content
	 *
	 * @return void
	 */
	public function settingPage() {
		$resources = array(
			'pages' => Utilities::getPageList(),
		);

		echo '<div 
			id="' . esc_attr( self::MOUNTPOINT_SETTINGS ) . '" 
			data-settings="' . esc_attr( wp_json_encode( (object) Settings::getSettings() ) ) . '"
			data-resources="' . esc_attr( wp_json_encode( $resources ) ) . '"></div>';
	}

	/**
	 * Add plugin action links in plugins page
	 *
	 * @return void
	 */
	public function pluginActionLinks( array $actions ) {

		$_actions = array(
			'crewhrm_dashboard' => '<a href="admin.php?page=' . Main::$configs->app_name . '">' . __( 'Dashboard', 'crewhrm' ) . '</a>',
			'crewhrm_pro_link'  => '<a href="https://getcrewhrm.com/pricing/" target="_blank">
										<span style="color: #ff7742; font-weight: bold;">' .
											__( 'Get Pro', 'crewhrm' ) .
										'</span>
									</a>'
		);

		$_actions = apply_filters( 'crewhrm_plugin_action_menus', $_actions );
		
		return array_merge( $actions, $_actions );
	}

	/**
	 * Show error notice if careers page is not setup
	 *
	 * @return void
	 */
	public function showCareersPageError() {
		$page_id = (int) Settings::getSetting( 'careers_page_id' );
		if ( $page_id > 0 ) {
			return;
		}
		
		$link = admin_url( 'admin.php?page=' . self::SLUG_SETTINGS . '&highlight=careers_page_id#/settings/recruitment/careers/' );
		?>
		<div class="notice notice-warning">
			<p><?php echo sprintf( __( 'Please <a href="%s">set up</a> a page to display the job posts.', 'crewhrm-pro' ), $link ); ?></p>
		</div>
		<?php
	}
}
