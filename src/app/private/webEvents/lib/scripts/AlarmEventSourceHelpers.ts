

/**
 *
 *Function : AlarmEventSourceToObs
 *
 * "Convert data from Streaming Text String to an usable Object"
 *
 * @param   eventSourceData JSON format i.e
 * @throws
 * @return  Object
 *
 */
export async function getEventToAlarm(event) {
  let _event = JSON.parse(event.data);
  if (_event.type == "remove") {
    return { command: "remove", content: _event };
  } else {
    return {
      webEventId: _event.target,
      webEventType: _event.type,
      webEventAlarm: {
        id: _event.data.alarmId,
        type: _event.data.alarmType,
        packetTime: _event.data.packetTime,
        location: _event.data.location,
        project: _event.data.projectId,
        uid: _event.data.uid,
        sensor: {
          name: _event.data.alarmInfo.sensorName,
          value: _event.data.alarmInfo.sensorValue,
          units: _event.data.alarmInfo.sensorUnits,
          type: _event.data.alarmInfo.sensorType,
          packetTime: _event.data.alarmInfo.packetTime,
          message: _event.data.alarmInfo.message,
          recordId: _event.data.alarmInfo.recordId,
          fluidLevel: _event.data.alarmInfo.fluidLevel,
          alarmLevel: _event.data.alarmInfo.alarmLevel,
          esdAlarmDepth: _event.data.alarmInfo.esdAlarmDepth,
          subdomain: _event.data.alarmInfo.subdomain
        }
      }
    };
  }
}

/*

alarmId: "5bd737d731228236a71cfff4_undefined_undefined"
alarmInfo:
alarmDepth: 350
alarmLevel: "CRITICAL"
alarmType: "FL3"
esdAlarmDepth: 370
fluidLevel: 803.4824000000001
message: "ESD Alarm Depth: 803.48 m"
packetTime: "2018-11-02T01:51:55.811Z"
recordId: "FL3_2018_11_01_19_51_44"
sendMail: true
subdomain: "http://telus.amsdev.ca"
uid: "0905"
__proto__: Object
alarmType: "FL3"
location: "bangalore"
locationId: "5bd737d731228236a71cfff4"
packetTime: "2018-11-02T01:51:55.811Z"
projectId: "Demo Dashboard"
uid: "0905"

*/

/**
 *
 *Function : AlarmEventSourceToObs
 *
 * "Convert data from Streaming Text String to an usable Object"
 *
 * @param   eventSourceData JSON format i.e
 * @throws
 * @return  Object
 *
 */
export async function getAppendedAlarmList(alarm, alarmList) {
  let newAlarmList = alarmList;
  if (alarm.webEventId) {
    let isNew = checkIsNew(alarm, alarmList);

    if (isNew == "new") {
      newAlarmList = newItem(alarm, alarmList);
    }

    if (isNew == "update") {
      newAlarmList = updateItem(alarm, alarmList);
    }

    if (isNew == "remove") {
      newAlarmList = removeItem(alarm, alarmList);
    }
  }
  return newAlarmList;
}

export async function getRemovedAlarmList(alarmId, alarmList) {
  let newAlarmList = removeItemById(alarmId, alarmList);
  return newAlarmList;
}

function checkIsNew(item, list) {
  let status = "";

  let isNew =
    list.filter(_item => {
      return _item.id == item.webEventAlarm.id;
    }).length == 0;

  if (item.webEventType == "remove") {
    status = "remove";
  }

  if (item.webEventType != "remove" && !isNew) {
    status = "update";
  }

  if (item.webEventType != "remove" && isNew) {
    status = "new";
  }
  return status;
}

/*
function checkIsNew(item,list){
  let status = '';
  if(item.webEventType == 'ALARM_CLEAR'){
    status = 'remove';
  }else{
    if(list.filter(_item => {  return _item.id == item.webEventAlarm.id } ).length == 0){
      status = 'new';
    }else{
      status = 'update';
    }
  }

 return status;
}

*/

function newItem(item, list) {
  let _list = list;
  _list.push(item.webEventAlarm);
  return _list;
}

function removeItem(item, list) {
  let _id = item.webEventAlarm.id;
  let _list = list.filter(_item => {
    return _item.id != _id;
  });
  return _list;
}

function updateItem(item, list) {
  let _list = list;
  let k = _list.findIndex(_item => {
    return _item.id == item.webEventId;
  });
  _list[k] = item.webEventAlarm;
  return _list;
}
function removeItemById(itemId, list) {
  let _id = itemId;
  let _list = list.filter(_item => {
    return _item.id != _id;
  });
  return _list;
}
export function getMapResToAlarm(object) {
  let alarm = {
    id: '',
    type: '',
    packetTime: '',
    location: '',
    project: '',
    uid: '',
    sensor: {
      name: '',
      type: '',
      value: '',
      units: '',
      packetTime: '',
      message: '',
      recordId: '',
      fluidLevel: '',
      alarmLevel: '',
      alarmDepth: '',
      esdAlarmDepth: '',
      subdomain: ''
    }
  };

  if (object) {
    if (object.alarmId) {
      alarm.id = object.alarmId;
    }

    if (object.alarmType) {
      alarm.type = object.alarmType;
    }

    if (object.packetTime) {
      alarm.packetTime = object.packetTime;
    }

    if (object.location) {
      alarm.location = object.location;
    }

    if (object.projectId) {
      alarm.project = object.projectId;
    }

    if (object.uid) {
      alarm.uid = object.uid;
    }

    if (object.alarmInfo) {
      if (object.alarmInfo.sensorName) {
        alarm.sensor.name = object.alarmInfo.sensorName;
      }

      if (object.alarmInfo.sensorValue) {
        alarm.sensor.value = object.alarmInfo.sensorValur;
      }

      if (object.alarmInfo.sensorUnits) {
        alarm.sensor.units = object.alarmInfo.sensorUnits;
      }

      if (object.alarmInfo.sensorType) {
        alarm.sensor.type = object.alarmInfo.sensorType;
      }
      if (object.alarmInfo.packetTime) {
        alarm.sensor.packetTime = object.alarmInfo.packetTime;
      }
      if (object.alarmInfo.message) {
        alarm.sensor.message = object.alarmInfo.message;
      }
      if (object.alarmInfo.recordId) {
        alarm.sensor.recordId = object.alarmInfo.recordId;
      }
      if (object.alarmInfo.fluidLevel) {
        alarm.sensor.fluidLevel = object.alarmInfo.fluidLevel;
      }
      if (object.alarmInfo.alarmLevel) {
        alarm.sensor.alarmLevel = object.alarmInfo.alarmLevel;
      }
      if (object.alarmInfo.alarmDepth) {
        alarm.sensor.alarmDepth = object.alarmInfo.alarmDepth;
      }
      if (object.alarmInfo.esdAlarmDepth) {
        alarm.sensor.esdAlarmDepth = object.alarmInfo.esdAlarmDepth;
      }
      if (object.alarmInfo.subdomain) {
        alarm.sensor.subdomain = object.alarmInfo.subdomain;
      }
    }
  } else {
    alarm = object;
  }

  return alarm;
}

/*
                        recordId : alarm["alarmInfo"]["recordId"],
                        fluidLevel : alarm["alarmInfo"]["fluidLevel"],
                        alarmLevel : alarm["alarmInfo"]["alarmLevel"],
                        alarmDepth : alarm["alarmInfo"]["alarmDepth"],
                        esdAlarmDepth : alarm["alarmInfo"]["esdAlarmDepth"],
                        subdomain : alarm["alarmInfo"]["subdomain"]

{
                                        id : alarm.alarmId,
                                        type : alarm.alarmType,
                                        packetTime : alarm.packetTime,
                                        location : alarm.location,
                                        project : alarm.projectId,
                                        uid : alarm.uid,
                                        sensor:{
                                          name : alarm["alarmInfo"]["sensorName"],
                                          type : alarm["alarmInfo"]["sensorType"],
                                          packetTime : alarm["alarmInfo"]["packetTime"],
                                          message : alarm["alarmInfo"]["message"],
                                          recordId : alarm["alarmInfo"]["recordId"],
                                          fluidLevel : alarm["alarmInfo"]["fluidLevel"],
                                          alarmLevel : alarm["alarmInfo"]["alarmLevel"],
                                          alarmDepth : alarm["alarmInfo"]["alarmDepth"],
                                          esdAlarmDepth : alarm["alarmInfo"]["esdAlarmDepth"],
                                          subdomain : alarm["alarmInfo"]["subdomain"]
                                        }


*/
