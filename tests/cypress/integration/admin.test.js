describe('Admin can login and make sure plugin is activated', () => {
	before(() => {
		cy.login();
	});

	it('Can activate plugin if it is deactivated', () => {
		cy.activatePlugin('crew-hrm');
	});

	it('Can visit "CrewHRM" page', () => {
		cy.visit('wp-admin/admin.php?page=crewhrm');
	});
});
