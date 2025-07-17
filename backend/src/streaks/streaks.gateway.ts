export const STREAKS_GATEWAY = 'STREAKS_GATEWAY';

export enum DayState {
  COMPLETED = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE',
  AT_RISK = 'AT_RISK',
  SAVED = 'SAVED',
}

export interface DayData {
  date: string;
  activities: number;
  state: DayState;
}

export interface UserActivityData {
  userData: DayData[];
}

export interface StreaksGateway {
  getCase(id: number): UserActivityData;
}
