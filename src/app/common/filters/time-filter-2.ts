const secondsToTime = totalSeconds => {
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  // round seconds
  seconds = Math.round(seconds * 100) / 100;

  let result = (hours < 10 ? '0' + hours : hours);
      result += ':' + (minutes < 10 ? '0' + minutes : minutes);
      result += ':' + (seconds  < 10 ? '0' + seconds : seconds);

  return result;
}

const intervalToTime = intervals => {
    for (let i = 0; i < intervals.length; i++) {
      intervals[i].interval = secondsToTime(intervals[i].interval);
    }
    return intervals;
}

export {
	secondsToTime,
	intervalToTime
}