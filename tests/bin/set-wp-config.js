#!/usr/bin/env node

const { writeFileSync } = require('fs');

let config = require(`../../.wp-env.json`);

const path = `${process.cwd()}/.wp-env.json`;

const args = {};
process.argv.slice(2, process.argv.length).forEach((arg) => {
	if (arg.slice(0, 2) === '--') {
		const param = arg.split('=');
		const paramName = param[0].slice(2, param[0].length);
		const paramValue = param.length > 1 ? param[1] : true;
		args[paramName] = paramValue;
	}
});

if (args.core || args.plugins) {
	if (args.core === 'latest') {
		delete args.core;
	}

	if (Object.keys(args).length > 0) {
		if (args.plugins) {
			args.plugins = args.plugins.split(',');
		}

		config = {
			...config,
			...args,
		};

		try {
			writeFileSync(path, JSON.stringify(config));
		} catch (err) {
			console.error(err);
		}
	}
}
