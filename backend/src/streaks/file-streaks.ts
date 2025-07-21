import { UserActivityData, StreaksGateway } from './streaks.gateway';
import * as exampleData from '../../data/example-data.json';

export class FileStreaks implements StreaksGateway {
  getExampleData(): UserActivityData {
    return exampleData as UserActivityData;
  }
}
