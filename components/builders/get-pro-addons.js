const fs = require('fs');
const path = require('path');
const { getAddonsBuildStructure } = require('../../../CrewHRM-Pro/components/builders/addons');

const pro_addons = getAddonsBuildStructure();

function extractPluginInfo(phpContent) {
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

const _addons = [];
for ( var i=0; i<pro_addons.length; i++ ) {
	const {index_path} = pro_addons[i];
	const index_file = path.resolve('../CrewHRM-Pro/'+index_path);
	const file_contents = fs.readFileSync(index_file).toString();

	_addons.push(extractPluginInfo( file_contents ));
}

fs.writeFileSync( path.resolve('./dist/libraries/pro-addons.json'), JSON.stringify(_addons, null, '\t') );
