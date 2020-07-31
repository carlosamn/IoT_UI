export function secondsToMS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return addZero(m) + ':' + addZero(s);
}

export function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

export function datetimeToDate(datetime) {
    var date = new Date(datetime);
    var output = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return output;
}

export function millisecondsToMSM(a) {
    if (a.toString().indexOf('.') > -1) {

    }
    else {
        a = a + '.000';
    }
    a = a.toString().split('.');
    var d = a[0];
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return addZero(m) + ':' + addZero(s) + '.' + a[1];
}

export function secondsToHMS(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return addZero(h) + ':' + addZero(m) + ':' + addZero(s);
}

export function hmsToSeconds(value) {
    var hms = '02:04:33';   // your input string
    var a = value.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    //var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    var secondsFromHours = (parseInt(a[0]) * 60) * 60;
    var secondsFromMinutes = (parseInt(a[1]) * 60);
    var seconds = parseInt(a[2]);

    return secondsFromHours + secondsFromMinutes + seconds;
}

export function msToSeconds(value) {
    var hms = '02:04:33';   // your input string
    var a = value.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    //var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    //var secondsFromHours = (parseInt(a[0]) * 60) * 60;
    var secondsFromMinutes = (parseInt(a[0]) * 60);
    var seconds = parseInt(a[1]);

    return secondsFromMinutes + seconds;
}

export function msmToSecondsOld(value) {
    var hms = '02:04:33.125';   // your input string
    var a = value.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    //var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var mi = '';
    if (value.indexOf('.') > -1) {
        mi = value.split('.');
    }
    else {
        mi = '000';
    }

    //var secondsFromHours = (parseInt(a[0]) * 60) * 60;
    var secondsFromMinutes = (parseInt(a[0]) * 60);
    var seconds = parseInt(a[1]);
    var milliseconds = parseInt(mi[1]);

    return (secondsFromMinutes + seconds) + '.' + milliseconds;
}

export function msmToSeconds(value) {
    var hms = '02:04:33.125';   // your input string
    var a = value.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    //var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    var mi = '';
    if (value.indexOf('.') > -1) {
        mi = value.split('.');
    }
    else {
        mi = '000';
    }

    //var secondsFromHours = (parseInt(a[0]) * 60) * 60;
    //var secondsFromMinutes = (parseInt(a[0]) * 60);
    //var seconds = parseInt(a[1]);
    var seconds = parseInt(mi[0]);
    var milliseconds = parseInt(mi[1]);
    return (seconds) + '.' + milliseconds;
    //return (parseInt(secondsFromMinutes) + parseInt(seconds)) + '.' + milliseconds;
}

export function addZero(value) {
    if (value.toString().length == 1) {
        return '0' + value;
    }
    else {
        return value;
    }
}

export function dateTimeFormat(datetime) {
    var d = new Date(datetime);
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var date = d.getDate() + " " + month[d.getMonth()] + ", " + d.getFullYear();
    var time = d.toLocaleTimeString().toLowerCase();
    return (date + " " + time);
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export function yearFromDatetime(datetime) {
    var d = new Date(datetime);
    return d.getFullYear();
}

export function monthFromDatetime(datetime) {
    var d = new Date(datetime);
    return d.getMonth();
}

export function dayFromDatetime(datetime) {
    var d = new Date(datetime);
    return d.getDate();
}

export function hourFromDatetime(datetime) {
    var d = new Date(datetime);
    return d.getHours();
}

export function minutesFromDatetime(datetime) {
    var d = new Date(datetime);
    return d.getMinutes();
}

export function secondsFromDatetime(datetime) {
    var d = new Date(datetime);
    return d.getSeconds();
}

export function typeUWI(LSD, Type) {
    if (Type == '1') {
        LSD = LSD.addAt(4, '/');
        LSD = LSD.addAt(7, '-');
        LSD = LSD.addAt(10, '-');
        LSD = LSD.addAt(14, '-');
        return LSD;
    }
    else if (Type == '2') {
        LSD = LSD.addAt(5, '/');
        LSD = LSD.addAt(10, '-');
        LSD = LSD.addAt(14, '-');
        LSD = LSD.addAt(16, '-');
        return LSD;
    }
    else {
        return LSD;
    }
}

export function addDot(value) {
    if (value != null) {
        if (value.indexOf(".") != -1) {
            return value;
        }
        else {
            value = value + '.000';
            return value;
        }
    }
}

export function subtractMinFromDate(timestamp, hours, minutes, seconds, milliseconds) {
    var date = new Date(parseInt(timestamp));

    date.setHours(date.getHours() - hours);
    date.setMinutes(date.getMinutes() - minutes);
    date.setSeconds(date.getSeconds() - seconds);
    date.setMilliseconds(date.getMilliseconds() - milliseconds);
    var d = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getMilliseconds());
    return d;
}

export function getHoursFromTimestamp(timestamp) {
    var date = new Date(parseInt(timestamp));
    return date.getUTCHours();
}

export function getMinutesFromTimestamp(timestamp) {
    var date = new Date(parseInt(timestamp));
    return date.getUTCMinutes();
}

export function getSecondsFromTimestamp(timestamp) {
    var date = new Date(parseInt(timestamp));
    return date.getUTCSeconds();
}

export function getMillisecondsFromTimestamp(timestamp) {
    var date = new Date(parseInt(timestamp));
    return threeDecimalOutput(date.getUTCMilliseconds());
}

export function threeDecimalOutput(value) {
    if (value.toString().length == 1) {
        return '00' + value;
    }
    else if (value.toString().length == 2) {
        return '0' + value;
    }
    else {
        return value;
    }
}

export function dateFormats(t, zero) {
    return ((t * 1)- zero).toFixed(0);
}

export function getTickArray(t, resolution) {
    var foo = new Float32Array(t);
    var tickArray = new Float32Array(t);
    var step = resolution;
    foo[0] = 0.0;
    tickArray[0] = 0.0;
    for(var i=1; i < foo.length; i++) {
        foo[i] = foo[i-1] + step;
        tickArray[i] = parseFloat(Number(foo[i]).toFixed(3));
    }
    return tickArray;
}

export function getFl3WavFilename(ackResponse) {
    let splittedString = ackResponse.split(',');
    let year = new Date().getFullYear();

    let filename = `FL3_${year}_${splittedString[2]}_${splittedString[3]}_${splittedString[4]}_${splittedString[5]}_${splittedString[6]}`;
    let shotStart = `${year}-${splittedString[2]}-${splittedString[3]} ${splittedString[4]}:${splittedString[5]}:${splittedString[6]}`;
    return { filename: filename, shotStart: shotStart };
}

export function convertFileNameToShotStart(filename) {
    let splitted = filename.split('_');
    let shotStartTime = `${splitted[1]}-${splitted[2]}-${splitted[3]} ${splitted[4]}:${splitted[5]}:${splitted[6]}`;
    return shotStartTime;
}

export function collarParams(ntdAvg, settings, kickTime) {
    ////console.log('PARAMS');
    ////console.log(`ntdAvg: ${ntdAvg} , kicktime: ${kickTime}`);
    const cycles = settings.collarAnalysis.collarCycles;
    let calipers = ntdAvg * cycles;
    console.log('ntdavg');
    console.log(ntdAvg);
    console.log('cycles');
    console.log(cycles);
    ////console.log(`Cycles: ${cycles}`);
    ////console.log(`Calipers: ${ntdAvg} * ${cycles} = ${calipers}`)
    //  500 = 10 * 50;
    //  ntdAvg = calipers / cycles;
    let jointsPerSec = (1 / calipers) * 1000;
    let jointsToLiquid =  (1 / (ntdAvg * cycles) ) * kickTime;
    let acousticFactor = ((2 * settings.wellData.distBetweenCollars * jointsToLiquid )  / kickTime) * 1000;
    return {
        calipers: calipers,
        jointsPerSec: jointsPerSec,
        jointsToLiquid: jointsToLiquid,
        acousticFactor: acousticFactor
    };
}

export function getCollarPlotLines(calipers, ntt, collarStart) {
    calipers = 50.00;
    let plotLines = [];
    let startLine = (ntt[0] - collarStart) * 1000;
    let iterations = ntt.length - 1;

    console.log(`First ntt: ${ntt[0]}, collarStart: ${collarStart}`);
    console.log('calipers value');
    console.log(calipers.toFixed(4));
    console.log('startLine');
    console.log(startLine.toFixed(4));     
    for(let i = 0; i < iterations; i++) {
        if(i > 0) startLine = startLine + calipers;
        plotLines.push({ color: '#FF0000', width: 2, value: startLine.toFixed(4), zIndex: 10 });
    }
    console.log('plotLines here');
    console.log(plotLines);
    ////console.log('PLOT LINES');
    ////console.log(plotLines);
    return plotLines;
}
//  { color: '#FF0000', width: 2, value: startLine, zIndex: 10 }
