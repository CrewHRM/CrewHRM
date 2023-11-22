## Crew HRM

WordPress Plugin for human resource management system. This is the free version repository where you can report bugs, vote on feature ideas, etc.

Please send pull requests if you find security issues or want to help us fix bugs.

To discuss ideas with us in private, please use the contact form on our website https://getcrewhrm.com/contact/

## Development environment setup
- Open terminal at <kbd>~/wp-content/plugins/</kbd> directory
- Run <kbd>git clone https://github.com/CrewHRM/CrewHRM.git</kbd>
- Run <kbd>cd CrewHRM</kbd>
- Run <kbd>npm install</kbd>
- Run <kbd>npm run build</kbd> to compile scirpts in production mode and create releasable zip file.
- Or, Run <kbd>npm run watch</kbd> if you'd like the codes to be compiled in development mode and need continuous compilation on code changes.

If it is cloned already, and need to pull updated codebase then 
- open terminal at <kbd>~wp-content/plugins/CrewHRM/</kbd>
- run <kbd>git pull</kbd> 
- and then <kbd>npm run build</kbd> or <kbd>npm run watch</kbd>

Whenever you pull updates to local repository, don't forget to run <kbd>npm install</kbd> and <kbd>npm run build</kbd> or <kbd>watch</kbd> again.
