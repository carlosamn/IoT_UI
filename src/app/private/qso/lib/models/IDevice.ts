import { timeStamp } from './../../../pit/pipeTimeStamp';
export interface IDevice {
  packetData: {
    analogInput1: number
    analogInput2: number
    analogInput3: number
  };
  packetType: number;
  timestamp: string;
  uid: string;
}

export function toIDevice(device) {
  try {
    const qsoDevice: IDevice = {
      packetData: {
        analogInput1: Number(device.packetData.analogInput1),
        analogInput2: Number(device.packetData.analogInput2),
        analogInput3: Number(device.packetData.analogInput3),
      },
      packetType: device.packetType,
      timestamp: device.packetTimestamp,
      uid: device.uid
    };
    return qsoDevice;
  } catch (e) {
    console.warn('Tenemos un Error en toIDevice(device)');
    console.warn('device');
    console.warn(device);
    console.warn(device.packetData);
    console.warn(device.packetData.analogInput1);
    console.warn(Number(device.packetData.analogInput1));
    return {};
  }
}

/**
 packetData:
analogInput1: "-5976.89"
analogInput2: "0.00"
analogInput3: "0.00"
__proto__: Object
packetType: 45
timeStamp: "2019-2-5 21:16:18"
uid: "15"
*/
