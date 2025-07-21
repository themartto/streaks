import { UserActivityData, UserDataGateway } from './user-data.gateway';
import * as exampleData from '../../data/example-data.json';

export class StreaksFromFile implements UserDataGateway {
  getExampleData(): UserActivityData {
    return exampleData as UserActivityData;
  }
}
