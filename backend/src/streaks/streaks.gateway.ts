export const STREAKS_GATEWAY = 'STREAKS_GATEWAY';

export interface DayData {
  date: string;
  activities: number;
}

export interface UserActivityData {
  userData: DayData[];
}

export interface StreaksGateway {
  getCase(id: number): UserActivityData;
}
