export function capitalizeAndReplaceSub(text) {
	let capitalizedText = capitalize(text);
	return replaceSub(capitalizedText);
}

export function capitalize(text) {
	return text.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() })
}

export function replaceSub(text) {
	return text.replace(/_/g, ' ');
}