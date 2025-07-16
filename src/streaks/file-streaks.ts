import { StreaksGateway } from './streaks.gateway';
import * as exampleData1 from '../../data/example-case-1.json';
import * as exampleData2 from '../../data/example-case-2.json';
import * as exampleData3 from '../../data/example-case-3.json';

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

export interface ExampleData {
  userData: DayData[];
}

export class FileStreaks implements StreaksGateway {
  getCase(id: number): ExampleData {
    const cases: Record<number, ExampleData> = {
      1: exampleData1 as ExampleData,
      2: exampleData2 as ExampleData,
      3: exampleData3 as ExampleData,
    };

    if (!(id in cases)) {
      throw new Error(`Invalid case ID: ${id}`);
    }

    return cases[id];
  }
}
