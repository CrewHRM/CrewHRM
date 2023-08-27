// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-file-upload';

Cypress.Commands.add('atleastOneMedia', () => {
	cy.login();
	// Check and upload at least one media file.
	cy.visit('/wp-admin/upload.php?mode=list');
	cy.get('body').then(($body) => {
		if ($body.find('.no-items').length !== 0) {
			cy.visit('/wp-admin/media-new.php?browser-uploader');
			cy.get('#async-upload').attachFile('../../../assets/images/icon-512.png');
			cy.get('#html-upload').click();
		}
	});
});

Cypress.Commands.add('selectImageOnClick', (btn, form_page, has_image_confirmed = false) => {
	if (!has_image_confirmed) {
		// Image handler
		cy.atleastOneMedia();

		// Back to originator page
		cy.visit(form_page);
	}

	cy.get(btn).click();
	cy.get('.media-menu-item:nth-child(2)').last().click();
	cy.get('li.attachment:first-child').last().click();
	cy.get('.media-button-select').last().click();

	cy.get('body').then(($body) => {
		if ($body.find('.media-button-insert').length !== 0) {
			cy.get('.media-button-insert').last().click();
		}
	});
});

Cypress.Commands.add('selectTab', (id) => {
	cy.get(`[href="#${id}"]`).click();
});

Cypress.Commands.add('fillInputFields', (fields, action) => {
	Object.keys(fields).forEach((selector) => {
		const value = fields[selector];
		cy.get(selector).as('input-field');

		switch (action) {
			case 'type':
				cy.get('@input-field').clear();
				cy.get('@input-field').type(value);
				break;

			case 'select':
				cy.get('@input-field').select(value);
				break;

			case 'checkbox':
				if (value === true) {
					cy.get('@input-field').check();
				} else {
					cy.get('@input-field').uncheck();
				}
				break;

			default:
				break;
		}
	});
});

Cypress.Commands.add('visitFirstPost', () => {
	// Visit the post list page and click view of first one
	cy.visit('wp-admin/edit.php');
	cy.get('table.posts .view a').first().click({ force: true });
});
