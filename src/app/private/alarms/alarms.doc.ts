/**
 *
 *  MockUp Model for Server Alarms Handler
 *
 *
 *
 *  -------------------------------------------------------
 *  --- GET ALL ALARMS ------------------------------------
 *  -------------------------------------------------------
 *    GET : http://amsdev.ca:3000/api/alarms?access_token=HmbLYgFKufs1xZRS98WEiVHET9HNyyMyN0PQmLm5l2cUo0xCJoccUevHYp3BluC9
 *  {
    "alarmId": "999_Demo",
    "alarmType": "SENSOR",
    "uid": "902",
    "packetTime": "2018-10-04T15:57:27.733Z",
    "projectId": "Demo dashboard",
    "location": "00f8f8af2e1849fe5a8cc9388381c0d5",
    "alarmInfo": {
      "sendMail": true,
      "alarmType": "FL3",
      "message": "ESD Alarm Depth: 350.6 m",
      "uid": "254",
      "packetTime": "2018-10-04T15:57:27.733Z",
      "recordId": "FL3_2018_10_04_09_57_36",
      "fluidLevel": 350.59819999999996,
      "alarmLevel": "CRITICAL",
      "alarmDepth": 9.5,
      "esdAlarmDepth": 9.5,
      "subdomain": "http://etdmongo.amsdev.ca"
    }
  }
 *  -------------------------------------------------------
 *
 *  -------------------------------------------------------
 *  --- POST NEW ALARM ------------------------------------
 *  -------------------------------------------------------
 *    POST : http://amsdev.ca:3000/api/alarms?access_token=HmbLYgFKufs1xZRS98WEiVHET9HNyyMyN0PQmLm5l2cUo0xCJoccUevHYp3BluC9
 *  {
    "alarmId": "999_Demo",
    "alarmType": "SENSOR",
    "uid": "902",
    "packetTime": "2018-10-04T15:57:27.733Z",
    "projectId": "Demo dashboard",
    "location": "00f8f8af2e1849fe5a8cc9388381c0d5",
    "alarmInfo": {
      "sendMail": true,
      "alarmType": "FL3",
      "message": "ESD Alarm Depth: 350.6 m",
      "uid": "254",
      "packetTime": "2018-10-04T15:57:27.733Z",
      "recordId": "FL3_2018_10_04_09_57_36",
      "fluidLevel": 350.59819999999996,
      "alarmLevel": "CRITICAL",
      "alarmDepth": 9.5,
      "esdAlarmDepth": 9.5,
      "subdomain": "http://etdmongo.amsdev.ca"
    }
  }
 *  -------------------------------------------------------
 *
 */
