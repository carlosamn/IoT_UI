'use strict';
//  Testing promises

/*await a = fetch('https://api.github.com/orgs/nodejs');
console.log(a);*/

const start = async () => {
	await doStuff0();
	await doStuff1();
	await doStuff2();
	await doStuff3();
};

start();

function doStuff0 () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Http request 0 ya devolvió datos, continuamos');
			resolve();
		}, 2000)
	});
}

function doStuff1 () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Http request 1 ya devolvió datos, continuamos');
			resolve();
		}, 2000)
	});
}

function doStuff2 () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Http request 2 ya devolvió datos, continuamos');
			resolve();
		}, 2000)
	});
}

function doStuff3 () {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Http request 3 ya devolvió datos-');
			resolve();
		}, 2000)
	});
}
