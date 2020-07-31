export interface IAlarmsNotification {
  id: string;
  location: {
    id: string,
    description: string
  },
  project: string,
  uid: string,
  timestamp: string,
  message: string,
  type: string;
  channel: {
    id: string;
    name: string;
    value: string;
    units: string;
  }
}
