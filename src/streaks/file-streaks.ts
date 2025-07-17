import { UserActivityData, StreaksGateway } from './streaks.gateway';
import * as exampleData1 from '../../data/example-case-1.json';
import * as exampleData2 from '../../data/example-case-2.json';
import * as exampleData3 from '../../data/example-case-3.json';

export class FileStreaks implements StreaksGateway {
  getCase(id: number): UserActivityData {
    const cases: Record<number, UserActivityData> = {
      1: exampleData1 as UserActivityData,
      2: exampleData2 as UserActivityData,
      3: exampleData3 as UserActivityData,
    };

    if (!(id in cases)) {
      throw new Error(`Invalid case ID: ${id}`);
    }

    return cases[id];
  }
}
