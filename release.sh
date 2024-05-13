#!/bin/bash

# Remove the svn-push directory
rm -rf ./svn-push/

# Check if zip file argument is provided
if [ $# -ne 1 ]; then
    echo "Usage: $0 <zip_file>"
    exit 1
fi

# Extract zip file name from command-line argument
ZIP_FILE=$1

# Check if zip file exists
if [ ! -f "$ZIP_FILE" ]; then
    echo "Error: $ZIP_FILE not found."
    exit 1
fi

# Extract the directory name from the zip file
DIRECTORY_NAME=$(basename -s .zip "$ZIP_FILE" | sed 's/-[0-9.]*$//')

# Extract version from the filename
VERSION=$(echo "$ZIP_FILE" | sed 's/.*-\([0-9.]*\)\.zip/\1/')

# 1. Create a directory named 'svn-push' in the working directory
mkdir -p ./svn-push/

# Get the SVN link from package.json
SVN_LINK=$(grep '"svn"' package.json | awk -F '"' '{print $4}')

# Check if the tag already exists
if svn ls $SVN_LINK/tags/$VERSION > /dev/null 2>&1; then
    # If the tag exists, terminate
	echo "$VERSION exists already"
    exit 1
fi

# 2. Pull the SVN link using svn
cd ./svn-push
svn checkout $SVN_LINK
cd ../

# 3. Unzip the zip file and extract only the children of the root directory
unzip $ZIP_FILE -d ./svn-push/tmp

# 4. Clear existing trunk directory
cd ./svn-push/$DIRECTORY_NAME
svn delete --force ./trunk/*
cd ../../

# and Move updated codebase to trunk
cp -r ./svn-push/tmp/$DIRECTORY_NAME/* ./svn-push/$DIRECTORY_NAME/trunk/
rm -rf ./svn-push/tmp/

# and add new tag
mkdir -p ./svn-push/$DIRECTORY_NAME/tags/$VERSION/
cp -r ./svn-push/$DIRECTORY_NAME/trunk/* ./svn-push/$DIRECTORY_NAME/tags/$VERSION/

# 5. Add, delete files from svn as per status
cd ./svn-push/$DIRECTORY_NAME/
svn add --force trunk/*
svn add --force tags/*
svn status | awk '/^\?/ {print $2}' | xargs svn add
svn status | awk '$1 == "!" {print $2}' | xargs -r svn delete

# 6. Commit finally
svn commit -m "Adding $DIRECTORY_NAME plugin version $VERSION" --username $SVN_USERNAME --password $SVN_PASSWORD
cd ../../

# 7. Remove the svn-push directory
rm -rf ./svn-push/
