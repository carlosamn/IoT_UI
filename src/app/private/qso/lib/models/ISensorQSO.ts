export interface IChannelSensorQSO {
  id: number;
  value: number;
  units: string;
  trend: number;
  enable: boolean;
  alarms: {
    high: {
      enable: boolean;
      limit: number;
    },
    low: {
      enable: boolean;
      limit: number;
    }
  };
  name: string;
}

export interface ISensorQSO {
  client: string;
  company: string;
  location: {
    id: string,
    description: string
  };
  isRetransmit: boolean;
  project: string;
  uid: string;
  timestamp: string;
  channels: IChannelSensorQSO[];
  layout: {
    containerIndex: number,
    itemIndex: number
  };
}

export interface IControllerSensorQSO {
  location: {
    id: string;
    description: string;
  };
  company: string;
  uid: string;
  trend: number;
  timestamp: string;
  channels: IChannelSensorQSO[];
}

export function toISensorQSO(sensor) {
  const qsoSensor: ISensorQSO = {
    client: sensor.clientCode,
    company: sensor.companyId,
    location: {
      id: sensor.locationId,
      description: sensor.description
    },
    isRetransmit: (sensor.retransmitBit === 1),
    project: sensor.projectId,
    uid: sensor.uid,
    timestamp: sensor.timestamp,
    layout: sensor.dashboardLayout,
    channels: [{
      id: 0,
      value: 0.0000,
      units: '',
      trend: 0,
      enable: false,
      alarms: {
        high: {
          enable: false,
          limit: 100000000000000000,
        },
        low: {
          enable: false,
          limit: -100000000000000000,
        }
      },
      name: ''
    },
    {
      id: 1,
      value: 0.0000,
      units: '',
      enable: false,
      trend: 0,
      alarms: {
        high: {
          enable: false,
          limit: 100000000000000000,
        },
        low: {
          enable: false,
          limit: -100000000000000000,
        }
      },
      name: ''
    },
    {
      id: 2,
      value: 0.0000,
      units: '',
      trend: 0,
      enable: false,
      alarms: {
        high: {
          enable: false,
          limit: 100000000000000000,
        },
        low: {
          enable: false,
          limit: -100000000000000000,
        }
      },
      name: ''
    },
    {
      id: 3,
      value: 0.0000,
      units: '',
      enable: false,
      trend: 0,
      alarms: {
        high: {
          enable: false,
          limit: 100000000000000000,
        },
        low: {
          enable: false,
          limit: -100000000000000000,
        }
      },
      name: ''
    }
    ]
  };
  return qsoSensor;
}
export function toIControllerSensorQSO(iSensorQSO) {
  const qsoControllerSensor: IControllerSensorQSO = {
    location: {
      id: iSensorQSO.location.id,
      description: iSensorQSO.location.description
    },
    company: iSensorQSO.company,
    uid: iSensorQSO.uid,
    trend: iSensorQSO.trend,
    timestamp: iSensorQSO.timestamp,
    channels: iSensorQSO.channels
  };
  return qsoControllerSensor;
}

