/**
 *  ----------------------------------------------------
 *    Function : streamingArrToObj()
 *    Description :
 *  ----------------------------------------------------
 */

export function getAlarmsByProject(alarms,project) {

  let outAlarmsByProject;
  let kOut = 0;

  let kAlarms = alarms.filter( alarm => {
    let p1 = alarm.project.replace(" ","_");
    let p2 = project.id.replace(" ","_");
    return  p1 == p2
  });

  outAlarmsByProject = kAlarms;

 return outAlarmsByProject;
}


export function appendAlarmsToProject(project,alarms) {
  return
}
