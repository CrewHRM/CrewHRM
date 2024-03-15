const fs = require('fs');
const path = require('path');
const { getAddonsBuildStructure, getMailTemplates } = require('./addons');

/* --------- Get pro addons --------- */
const pro_addons = getAddonsBuildStructure();

function extractFileMeta(phpContent) {
	const pluginInfo = {};
	const lines = phpContent.split('\n');
	let inCommentBlock = false;

	for (const line of lines) {
		if (inCommentBlock) {
			const parts = line.split(':');
			if (parts.length >= 2) {
				const key = parts[0].replace(/^\s*\*\s*@?/, '').trim().toLowerCase().replaceAll(' ', '_');
				const value = parts.slice(1).join(':').trim();
				pluginInfo[key] = value==='true' ? true : (value==='false' ? false : value);
			} else if (line.trim() === '*/') {
				// End of the comment block
				break;
			}
		} else if (line.trim() === '/**') {
			inCommentBlock = true;
		}
	}

	return pluginInfo;
}

// Rebuild pro data directory
const pro_dir       = './dist/libraries/pro/';
const thumbnail_dir = pro_dir + 'thumbnails/';
if ( fs.existsSync(pro_dir) ) {
	fs.rmSync(pro_dir, {recursive: true, force: true});
}
fs.mkdirSync(thumbnail_dir, {recursive: true});

const _addons = [];
for ( var i=0; i<pro_addons.length; i++ ) {
	const {index_path, thumbnail_path} = pro_addons[i];
	const index_file = path.resolve('../CrewHRM-Pro/'+index_path);
	const file_contents = fs.readFileSync(index_file).toString();

	const manifest = extractFileMeta( file_contents );

	// Put the JSON data 
	_addons.push(manifest);

	// Copy the thumbnail
	fs.copyFile( path.resolve('../CrewHRM-Pro/' + thumbnail_path), thumbnail_dir + manifest.crewhrm_id + '.png', (e)=>{
		if (e) {
			throw e;
		}
	});
}

fs.writeFileSync( path.resolve(pro_dir+'addons.json'), JSON.stringify(_addons, null, '\t') );



/* --------- Get pro email templates --------- */
const mails     = getMailTemplates();
const templates = mails.map(filePath=>{
	const meta = extractFileMeta( fs.readFileSync( filePath ).toString() );
	return {
		id    : path.basename(filePath, path.extname(filePath)),
		label : meta.template_label
	}
});

fs.writeFileSync( path.resolve(pro_dir+'mail-templates.json'), JSON.stringify(templates, null, '\t') );
