import { ExampleData } from './file-streaks';

export const STREAKS_GATEWAY = 'STREAKS_GATEWAY';

export interface StreaksGateway {
  getCase(id: number): ExampleData;
}
