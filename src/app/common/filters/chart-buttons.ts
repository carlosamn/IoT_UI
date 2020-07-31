export function highlightButtons(type, types) {
    let className = `button-${type}`;
    types.forEach(typeButton => { 
    	if(typeButton != type) $(`.button-${typeButton}`).removeClass('highlighted-chart-green highlighted-chart-red');
    });

    if (className === 'button-lock') {
	    $(`.${className}`).toggleClass('highlighted-chart-green');
    } else {
    	$(`.${className}`).toggleClass('highlighted-chart-red');
    }
}
