const { defineConfig } = require('cypress');
const index = require('./plugins');

module.exports = defineConfig({
	fixturesFolder: `${__dirname}/fixtures`,
	screenshotsFolder: `${__dirname}/screenshots`,
	videosFolder: `${__dirname}/videos`,
	downloadsFolder: `${__dirname}/downloads`,
	video: true,
	reporter: 'mochawesome',
	reporterOptions: {
		mochaFile: 'mochawesome-[name]',
		reportDir: `${__dirname}/reports`,
		overwrite: false,
		html: false,
		json: true,
	},
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return index(on, config);
		},
		specPattern: `${__dirname}/integration/**/*.test.{js,jsx,ts,tsx}`,
		supportFile: `${__dirname}/support/index.js`,
	},
});
