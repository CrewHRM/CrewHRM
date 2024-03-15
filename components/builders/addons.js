/**
 * This script is supposed to be used for only plugin build, compiling functionalities.
 * Do not add code that is supposed to go with built version.
 */

const path = require('path');
const fs   = require('fs');

const _addons_dir = path.resolve(__dirname, '../../../CrewHRM-Pro/addons');
const mails_dir  = path.resolve(__dirname, '../../../CrewHRM-Pro/addons/Email/templates');

module.exports.getAddonsBuildStructure=function(addons_dir) {

	const builder_mapping = [];

	if ( ! addons_dir ) {
		addons_dir = _addons_dir;
	}

	// Pro will not exist for public contributor of free version
	if ( ! fs.existsSync(addons_dir) ) {
		return builder_mapping;
	}

	fs.readdirSync(addons_dir).forEach(function (addon_name) {

		const scripts_path = `${addons_dir}/${addon_name}/components/`;
		const dist_path = `./addons/${addon_name}/dist`;
		const index_path = `./addons/${addon_name}/index.php`;
		const thumbnail_path = `./addons/${addon_name}/thumbnail.png`;

		// Make sure the addon has components directory
		if ( !fs.existsSync(scripts_path) || ! fs.lstatSync(scripts_path).isDirectory() ) {
			return;
		}

		const files_to_compile = {};

		// Loop throw the immediate files in the components directory
		fs.readdirSync(scripts_path).forEach(function(script_name){
			const file_path = scripts_path + script_name;
			const script_name_no_ext = path.parse(file_path).name;

			// Exclude non file, only immediate files will be compiled into the dist directory as index/entry point.
			if ( path.extname( file_path) !== '.jsx' || ! fs.lstatSync(file_path).isFile() ) {
				return;
			}

			files_to_compile[script_name_no_ext] = `./addons/${addon_name}/components/${script_name}`;
		});

		if ( Object.keys(files_to_compile).length ) {
			builder_mapping.push({
				index_path: index_path,
				dest_path: dist_path,
				src_files: files_to_compile,
				thumbnail_path: thumbnail_path
			});
		}
	});

	return builder_mapping;
}

module.exports.getMailTemplates=function() {

	const mails = [];

	// Pro will not exist for public contributor of free version
	if ( ! fs.existsSync(mails_dir) ) {
		return mails;
	}

	fs.readdirSync(mails_dir).forEach(function (template_name) {

		const template_path = mails_dir+'/'+template_name;
		
		// Make sure the addon has components directory
		if ( ! fs.existsSync(template_path) || ! fs.lstatSync(template_path).isFile() ) {
			return;
		}

		mails.push(template_path);
	});

	return mails;
}
