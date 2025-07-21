export const USER_DATA_GATEWAY = 'USER_DATA_GATEWAY';

export interface DayData {
  date: string;
  activities: number;
}

export interface UserActivityData {
  userData: DayData[];
}

export interface UserDataGateway {
  getExampleData(): UserActivityData;
}
