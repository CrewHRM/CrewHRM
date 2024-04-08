const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');

function removeFilesNotInSource(sourceDir, targetDir) {
  fs.readdir(targetDir, (err, targetFiles) => {
    if (err) {
      console.error(`Error reading target directory: ${err}`);
      return;
    }

    targetFiles.forEach((targetFile) => {
      const sourceFilePath = path.join(sourceDir, targetFile);
      const targetFilePath = path.join(targetDir, targetFile);
	
	  // Check for files or directories to exclude
      if (
        targetFile === '.git' || // Exclude .git directory
        targetFile === '.gitignore' || // Exclude .gitignore file
        targetFile === '.DS_Store' || // Exclude .DS_Store file
        targetFile.endsWith('.zip') // Exclude zip files
      ) {
        return;
      }

      fs.access(sourceFilePath, fs.constants.F_OK, (sourceErr) => {
        if (sourceErr) {
          // File does not exist in source, so we can remove it from the target
          fs.unlink(targetFilePath, (deleteErr) => {
            if (deleteErr) {
              console.error(`Error deleting file: ${deleteErr}`);
            }
          });
        }
      });
    });
  });
}

module.exports.syncDirectory=function(sourceDir, targetDir) {
	
	const rsyncCommand = `rsync -av --exclude='.git/' --exclude='.gitignore' --exclude='.DS_Store' --exclude='*.zip' ${sourceDir}/ ${targetDir}`;

	const watcher = chokidar.watch(sourceDir, {
		ignored: /(^|[\/\\])\../, // ignore dotfiles
		persistent: true,
	});

	watcher
		.on('add', (path) => syncDirectory())
		.on('addDir', (path) => syncDirectory())
		.on('unlinkDir', (path) => syncDirectory())
		.on('change', (path) => syncDirectory())
		.on('unlink', (path) => syncDirectory());

	function syncDirectory() {
		exec(rsyncCommand, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error syncing directories: ${error}`);
			} else {
				removeFilesNotInSource(sourceDir, targetDir);
			}
		});
	}
}
