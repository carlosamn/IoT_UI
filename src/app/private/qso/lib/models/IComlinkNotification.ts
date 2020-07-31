export interface IComlinkNotification {
  location: {
    id: string,
    description: string
  },
  project: string,
  uid: string,
  timestamp: string,
  message: string,
  type: string
}
