export function timeToSeconds(time) {

  const splittedTime = time.split(':');

  // Hours are worth 60 minutes.
  const minutes = (+splittedTime[0]) * 60 + (+splittedTime[1]);
  const seconds = splittedTime[2] * 1000;
  const timeInSeconds = (minutes * 60 * 1000) + seconds;

  return timeInSeconds;
}
