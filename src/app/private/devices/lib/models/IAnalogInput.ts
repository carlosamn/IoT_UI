export interface IAnalogInput {
  id: string;
  uid: string;
  channelId: string;
  packetType: string;
  inSync: string;
  name: string;
  notifyDevice: string;
  clientCode: string;
  showinmap: boolean;
  enable: boolean;
  unit: string;
  analog_h: string;
  analog_l: string;
  physical_h: string;
  physical_l: string;
  alarm_h: number;
  alarm_l: number;
  enable_alarm_h: boolean;
  enable_alarm_l: boolean;
  text_h: string;
  text_l: string;
  trendTimeMin: number;
  trendDelta: number;
  trendEnable: boolean;
}




