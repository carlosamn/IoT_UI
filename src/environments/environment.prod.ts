// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  defaultCompany: 'ams',
  basepath: getCurrentUri()
};

function getCurrentUri() {
	let port = 3000;
	let uri = '';

	if (location.hostname === 'localhost' || isDev() || location.hostname === 'http://35.182.172.115'  || location.hostname === '192.168.1.2') {
		 uri = `http://35.182.172.115:${port}/api`;
		 //uri = `http://localhost:${port}/api`;
	}
	else uri = `http://${location.hostname}:${port}/api`;
	return uri;
}

function isDev() {
	let hostname = location.hostname;
	let splittedHostName = hostname.split('.');
	if(splittedHostName[1] === 'amsdev' || splittedHostName[0] === 'amsdev') return true;
	else return false;
}