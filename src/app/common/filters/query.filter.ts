export function filterQuery(data, type?) {
	//  &filter[where][projectIds]=CompanyA
	let isArray = Array.isArray(data);
	let result;
	if(isArray) {
		alert('No supported arrays');
	} else {
		result = objectToQueryFilter(data, type);
		return result;
	}
}

function arrayToQueryFilter(array) {
	let queryString;
	let filterLiteral = '&filter';
} 

function objectToQueryFilter(object, type) {
	let typeFilter = '';

	if(type && type == 'nowhere') {
		typeFilter = '';
	} else if(!type) {
		typeFilter = `[where]`;
	} else {
		typeFilter = `[${type}]`;
	}

	let objectLength = Object.keys(object).length;
	let arrayWhere = [];
	for(let i in object) {
		if(object.hasOwnProperty(i)) {
			arrayWhere.push(`${typeFilter}[${i}]=${object[i]}`);
		}
	}

	let queryString = '';
	for(let i = 0; i < arrayWhere.length; i++) {
		if(arrayWhere.length === 1) queryString = `${queryString}?filter${arrayWhere[i]}`;
		else {
			if(i === 0) queryString = `${queryString}?filter${arrayWhere[i]}`;
			else queryString = `${queryString}&filter${arrayWhere[i]}`;
		}
	}
	return queryString;
}