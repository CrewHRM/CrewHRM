const path = require('path');
const fs = require('fs');
const { syncDirectory } = require('./sync-directory');

const materialsPath = path.resolve('../Materials');
const materialsPathNode = path.resolve('./node_modules/crewhrm-materials');

if (fs.existsSync(materialsPath) && fs.existsSync(materialsPathNode)) {
	console.log('Watching for changes in ../Materials directory...');
	syncDirectory(materialsPath, materialsPathNode);
} else {
	console.error('One or both directories do not exist.');
}