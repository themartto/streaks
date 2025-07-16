import { Injectable, Inject } from '@nestjs/common';
import { StreaksRepository } from './streaks.repository';
import { STREAKS_REPOSITORY } from './streaks.repository';

@Injectable()
export class StreaksService {
  constructor(
    @Inject(STREAKS_REPOSITORY) private readonly repository: StreaksRepository,
  ) {}

  getAll(): Promise<[]> {
    return this.repository.getAll();
  }
}
