import { environment } from '../../../environments/environment';

const basepath = environment.basepath;

export function getArrayOfLocations(projectId, userData) {
	let result = userData.locationIds.find(location => location.projectId == projectId);
	let locations = [];
	result.locationId.map(location => locations.push(location.locationId));
	return locations;
}

export function selectAllLocationIds(locations) {
	const ids = locations.map(location => location.locationId);
	return ids;
}

export function selectAllLocationIdsByCompany(locations, companies) {
	const companyIds = companies.map(company => company.id);
	//  Aqui obtenemos las locations que tienen que ver con los companies
/*	const results = locations.filter(location => companyIds.includes(location.companyId));
	const ids = results.map(location => location.locationId);*/

	const ids = locations.filter(location => 
					companyIds
						.includes(location.companyId))
						.map(result => result.locationId);

	return ids;
}

export function parseLocationsAndProjects(projectsArray) {
	let locationIds = [],
		projectIds = [];

	projectsArray.forEach(projectArray => {
		let locations = projectArray.locations;
		locationIds.push({
			projectId: projectArray.selectedProject,
			locationId: locations.filter(location => projectArray.selectedLocations.includes(location.locationId))
		});

		projectIds.push(projectArray.selectedProject);
	});
	return { locationIds, projectIds };
}


export function	createImageInDataURL(urlImage, recordId):Promise<string> {
	let fullURL = `${basepath}${urlImage}`;
    return new Promise((resolve: Function, reject: Function) => {
        var img = new Image,
        src = fullURL,
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

        img.crossOrigin = "Anonymous";

        var me = this;
        img.onload = function() {
        	const width = img.width;
        	const height = img.height;
        	canvas.width = width;
        	canvas.height = height;
            context.drawImage(img, 0, 0, width, height);
            var dataURL = canvas.toDataURL();
            resolve(dataURL);
        }

        img.onerror = async function(error) {
        	try {
	        	let notAvailableBlob = await me.createBlobForNotAvailable();
	        	resolve(notAvailableBlob);
        	} catch (ex) {
        		console.log(ex);
        		reject(ex);
        	}
        }

        img.src = src;
    });
}

export function	createBlobForNotAvailable():Promise<string> {
	const notAvailableURL = `${basepath}/containers/clientcollarrecords/download/not-available.jpeg`;
    return new Promise((resolve: Function, reject: Function) => {
        var img = new Image,
        src = notAvailableURL,
        canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

        img.crossOrigin = "Anonymous";

        var me = this;
        img.onload = function() {
        	const width = img.width;
        	const height = img.height;
        	canvas.width = width;
        	canvas.height = height;
            context.drawImage(img, 0, 0, width, height);
            var dataURL = canvas.toDataURL();
            resolve(dataURL);
        };

        img.onerror = function(error) {
        	reject(error);
        }

        img.src = src;
    });
}

export function formatDateForChart (date) {
	let result : any = {};
	const formattedDate = new Date(date);
	result.year = formattedDate.getFullYear();
	result.month = formattedDate.getMonth() + 1;
	result.day = formattedDate.getDate();
	result.hour = formattedDate.getUTCHours();
	result.minute = formattedDate.getMinutes();
	result.seconds = formattedDate.getSeconds();
	for (var property in result) {
	    if (result.hasOwnProperty(property)) {
	    	if (result[property].toString().length === 1) {
	    		result[property] = `0${result[property].toString()}`;
	    	}
	    }
	}

	return `${result.year}-${result.month}-${result.day} ${result.hour}:${result.minute}:${result.seconds}`;
}

export function returnChangedObjects(oldArray, newArray) {
    let changedItems = [];
    newArray.forEach(newItem => {
        let isNotChanged = oldArray.find(oldItem => JSON.stringify(newItem) === JSON.stringify(oldItem));
        if (!isNotChanged) changedItems.push(newItem);
    });
    return changedItems;
}