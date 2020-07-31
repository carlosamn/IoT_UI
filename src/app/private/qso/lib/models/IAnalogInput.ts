export interface IAnalogInput {
  alarm_h: number;
  alarm_l: number;
  analog_h: number;
  analog_l: number;
  channelId: number;
  clientCode: string;
  enable: boolean;
  enable_alarm_h: boolean;
  enable_alarm_l: boolean;
  id: string;
  name: string;
  notifyDevice: boolean;
  packetType: number;
  physical_h: number;
  physical_l: number;
  showinmap: boolean;
  text_h: string;
  text_l: string;
  trendDelta: number;
  trendEnable: boolean;
  trendTimeMin: number;
  uid: string;
  unit: string;
}



/*
alarm_h: 65535
alarm_l: 0
analog_h: 5
analog_l: 0
channelId: 1
clientCode: "AMS"
enable: true
enable_alarm_h: true
enable_alarm_l: true
id: "5b89a68ea5498920f8458a40"
name: "Sensor 1"
notifyDevice: false
packetType: 19
physical_h: 65535
physical_l: 0
showinmap: false
text_h: "High Alarm Warning"
text_l: "Low Alarm Warning"
trendDelta: 1000
trendEnable: true
trendTimeMin: 5
uid: "914"
unit: "kpa"
http://localhost:3000/api/devices/sensordata/uid/901,902?access_token=c2Noosa16MboDfoo15e3IkrSZn2a6AoAFWwXRP4Ka6Z5kaVfK2ypHVJfX3m6KpY2
*/
