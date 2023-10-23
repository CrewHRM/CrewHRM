const path = require('path');
const fs = require('fs');
const { syncDirectory } = require('./sync-directory');

const materials_path = path.resolve('../Materials');
const materials_path_node = path.resolve('./node_modules/crewhrm-materials');

if ( fs.existsSync(materials_path) && fs.existsSync(materials_path_node) ) {
	syncDirectory('./node_modules/crewhrm-materials', '../Materials');
}
