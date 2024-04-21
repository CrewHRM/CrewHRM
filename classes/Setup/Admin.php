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
use CrewHRM\Models\Mailer;
use CrewHRM\Models\Settings;
use CrewHRM\Models\User;

/**
 * The setup class
 */
class Admin {
	const SLUG_SETTINGS        = 'crewhrm-settings';
	const MOUNTPOINT_SETTINGS  = 'crewhrm_settings';
	const PAGE_SLUG_CALENDAR   = 'crewhrm-event-calendar';
	const PAGE_SLUG_ALL_JOBS   = 'crewhrm-all-jobs';
	const PAGE_SLUG_EMPLOYEE   = 'crewhrm-employees';

	/**
	 * Setup admin menus
	 *
	 * @return void
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'registerMenu' ), 10 );
		add_action( 'admin_menu', array( $this, 'registerCalendar' ), 10 );
		add_filter( 'plugin_action_links_' . Main::$configs->basename, array( $this, 'pluginActionLinks' ) );
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
			esc_html__( 'Event Calendar', 'hr-management' ),
			esc_html__( 'Event Calendar', 'hr-management' ),
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
		$logo = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE4Ni45NDQgMTcwLjcxNEMxNzkuMDUyIDE4My44MDggMTY3LjkzMSAxOTIuOTU1IDE1My45NCAxOTguMTU3QzE0My4zNTcgMjAyLjEwMyAxMzIuNDE2IDIwMy43MTcgMTIxLjI5NSAyMDIuNjQxQzEwNi41ODcgMjAxLjIwNiA5My40OTM1IDE5NS4xMDggODIuNTUyMSAxODQuNTI1QzczLjA0NTYgMTc1LjAxOSA2Ny4xMjY1IDE2My4zNiA2NC43OTQ4IDE0OS45MDdDNjEuOTI0OSAxMzMuNzY0IDYzLjcxODYgMTE4LjE1OSA3MS4yNTIgMTAzLjgxQzc3LjcwOTIgOTEuMjU0NCA4Ny4yMTU2IDgyLjI4NjEgOTkuNTkxOSA3Ni4zNjdDMTA4LjIwMiA3Mi4yNDE1IDExNy4xNyA3MC4yNjg1IDEyNi40OTcgNzAuMDg5MUMxMjcuNzUzIDcwLjA4OTEgMTMwLjA4NCA2OS45MDk3IDEzMC40NDMgNjguNjU0MkMxMzIuNzc1IDYyLjM3NjMgMTM0LjM4OSA1Ni40NTcyIDEzOC4xNTYgNTAuODk2OEMxMzguNjk0IDUwLjE3OTQgMTM5LjQxMSA1MCAxNDAuMTI5IDUwLjE3OTRMMTU2LjgxIDU2LjI3NzlDMTU3Ljg4NiA1Ni42MzY2IDE1OC4yNDUgNTguMDcxNSAxNTcuNzA3IDU4Ljk2ODRDMTU0LjgzNyA2My40NTI1IDE0Mi4yODEgNzIuMDYyMSAxNDcuNjYyIDcyLjYwMDJDMTUxLjQyOSA3Mi45NTkgMTUzLjQwMiA3My42NzY0IDE1NS4xOTYgNzQuMjE0NUMxNjQuMTY0IDc3LjA4NDQgMTcyLjA1NiA4MS41Njg2IDE3OC42OTMgODguNTYzOUMxODQuMDc0IDk0LjQ4MyAxODcuNDgyIDEwMS4yOTkgMTg3LjQ4MiAxMDkuNTVDMTg3LjQ4MiAxMjIuMjg1IDE3OS43NjkgMTMxLjYxMiAxNjcuOTMxIDEzMy45NDRDMTQ5LjQ1NiAxMzcuNTMxIDEzMy42NzIgMTI3LjEyOCAxMjcuMzk0IDEwNy45MzZDMTI1Ljc4IDEwMi43MzQgMTI0LjcwMyA5Ny4zNTI5IDEyNC41MjQgOTEuOTcxOUMxMjQuNTI0IDkxLjQzMzggMTI0LjM0NSA5MS4wNzUgMTI0LjM0NSA5MC41MzY5QzEyMC4zOTkgOTAuNzE2MyAxMTYuODExIDkxLjQzMzggMTEzLjIyNCA5Mi44Njg3QzEwMC4zMDkgOTcuNzExNiA5MS42OTk4IDEwNy4yMTggODcuNzUzNyAxMjAuODVDODMuNDQ4OSAxMzUuMzc5IDg0Ljg4MzkgMTQ5LjU0OSA5Mi41OTY2IDE2Mi42NDJDOTguNjk1MSAxNzMuMDQ2IDEwNy40ODQgMTc5Ljg2MiAxMTguOTY0IDE4MS44MzVDMTM1LjgyNCAxODQuNzA1IDE1MS4wNyAxODAuNTc5IDE2My4yNjcgMTY3LjMwNk0xNDQuOTcyIDkzLjQwNjhDMTQyLjgxOSA5NC4zMDM2IDE0Ni40MDcgMTA0Ljg4NiAxNDkuOTk0IDEwOS43MjlDMTUyLjE0NiAxMTIuNzc4IDE1NS4xOTYgMTE0LjU3MiAxNTguNzgzIDExNC45MzFDMTYyLjU1IDExNS4yOSAxNjUuMjQgMTEzLjMxNyAxNjUuOTU4IDEwOS43MjlDMTY2LjQ5NiAxMDYuODU5IDE2NS40MiAxMDQuNTI4IDE2My42MjYgMTAyLjM3NUMxNjAuMzk3IDk4LjYwODUgMTU2LjA5MyA5Ni40NTYgMTUxLjc4OCA5NC40ODNDMTUxLjk2NyA5NC42NjI0IDE0Ni41ODYgOTIuNjg5MyAxNDQuOTcyIDkzLjQwNjhaIiBmaWxsPSIjOURBMkE4Ii8+PC9zdmc+';

		$white_label = Utilities::getWhiteLabel();
		if ( ! empty( $white_label['app_logo'] ) ) {
			add_action(
				'admin_head',
				function() use ( $white_label ) {
					?>
					<style>
						.toplevel_page_crewhrm .wp-menu-image.svg {
							background-image: url(<?php echo esc_url( $white_label['app_logo'] ); ?>) !important;
						}
					</style>
					<?php
				}
			);
		}

		$admin_role = User::getAdminMenuRole( get_current_user_id() );

		// Main page
		add_menu_page(
			$white_label['app_label'],
			$white_label['app_label'],
			$admin_role,
			Main::$configs->app_name,
			array( $this, 'mainPage' ),
			$logo
		);
		add_submenu_page(
			Main::$configs->app_name,
			esc_html__( 'Dashboard', 'hr-management' ),
			esc_html__( 'Dashboard', 'hr-management' ),
			$admin_role,
			Main::$configs->app_name,
			array( $this, 'mainPage' )
		);

		// All Jobs
		add_submenu_page(
			Main::$configs->app_name,
			esc_html__( 'All Job Posts', 'hr-management' ),
			esc_html__( 'All Job Posts', 'hr-management' ),
			$admin_role,
			self::PAGE_SLUG_ALL_JOBS,
			array( $this, 'allJobsPage' )
		);

		// Employee profiles
		add_submenu_page(
			Main::$configs->app_name,
			esc_html__( 'Employees', 'hr-management' ),
			esc_html__( 'Employees', 'hr-management' ),
			$admin_role,
			self::PAGE_SLUG_EMPLOYEE,
			array( $this, 'employeePage' )
		);

		// Setting page
		add_submenu_page(
			Main::$configs->app_name,
			esc_html__( 'Settings', 'hr-management' ),
			esc_html__( 'Settings', 'hr-management' ),
			$admin_role,
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
				id="crewhrm_dashboard" 
				data-application-stats="' . esc_attr( wp_json_encode( $application_overview ) ) . '"></div>';
	}

	/**
	 * Provide HTML content for 'all jobs' page
	 *
	 * @return void
	 */
	public function allJobsPage() {
		echo '<div id="crewhrm_dashboard_all_jobs"></div>';
	}

	/**
	 * Provide HTML content for 'employees' page
	 *
	 * @return void
	 */
	public function employeePage() {
		$departments = Department::getDepartments();
		echo '<div 
				id="crewhrm_employees_dashboard" 
				data-departments="' . esc_attr( wp_json_encode( $departments ) ) . '"></div>';
	}

	/**
	 * Setting page content
	 *
	 * @return void
	 */
	public function settingPage() {

		$mail_templates = Mailer::getMailTemplates();

		// Add promotional email lists from prebuilt JSON
		if ( ! Main::$configs->has_pro ) {
			$json_path = Main::$configs->dir . 'dist/libraries/pro/mail-templates.json';
			$pro_mails = json_decode( file_get_contents( $json_path, true ) );

			foreach ( $pro_mails as $mail ) {
				$mail->locked                = true;
				$mail->tooltip               = esc_html__( 'Need to upgrade to Pro', 'hr-management' );
				$mail_templates[ $mail->id ] = (array) $mail;
			}
		}

		// Prepare the overall mail templates array
		$mail_templates = array_filter(
			$mail_templates,
			function( $template ) {
				return ! ( $template['exclude_from_settings'] ?? false );
			}
		);
		$mail_templates = array_values( $mail_templates );

		// Build final resource
		$resources = array(
			'pages'         => Utilities::getPageList( -1 ),
			'email_events'  => $mail_templates,
			'business_type' => Settings::getBusinessTypesDropdown(),
		);

		echo '<div 
			id="' . esc_attr( self::MOUNTPOINT_SETTINGS ) . '" 
			data-settings="' . esc_attr( wp_json_encode( (object) Settings::getSettings() ) ) . '"
			data-resources="' . esc_attr( wp_json_encode( $resources ) ) . '"></div>';
	}

	/**
	 * Add plugin action links in plugins page
	 *
	 * @param array $actions Plugin action links
	 * @return array
	 */
	public function pluginActionLinks( array $actions ) {

		$_actions = array(
			'crewhrm_dashboard' => '<a href="admin.php?page=' . Main::$configs->app_name . '">' . esc_html__( 'Dashboard', 'hr-management' ) . '</a>',
			'crewhrm_pro_link'  => '<a href="https://getcrewhrm.com/pricing/" target="_blank">
										<span style="color: #ff7742; font-weight: bold;">' .
											esc_html__( 'Get Pro', 'hr-management' ) .
										'</span>
									</a>',
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
		if ( ! empty( $page_id ) ) {
			return;
		}

		$link = admin_url( 'admin.php?page=' . self::SLUG_SETTINGS . '&highlight=careers_page_id#/settings/recruitment/careers/' );
		?>
		<div class="notice notice-warning">
			<p>
				<?php
					// translators: Careers page setup warning
					echo sprintf( esc_html__( 'Please %1$sset up%2$s a page to display the job posts.', 'hr-management' ), '<a href="' . esc_url( $link ) . '">', '</a>' );
				?>
			</p>
		</div>
		<?php
	}
}
