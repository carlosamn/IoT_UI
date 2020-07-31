export function transformYoutubeUrl(_url) {
	if (!_url) return '';
	else _url = _url.replace('watch?v=','embed/');
	return _url;
}