import { StreaksRepository } from './streaks.repository';
import { promises as fs } from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../../example-data.json');

export class FileStreaksRepository implements StreaksRepository {
  async getAll(): Promise<[]> {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }
}
