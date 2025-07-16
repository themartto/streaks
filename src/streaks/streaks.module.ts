import { Module } from '@nestjs/common';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { STREAKS_REPOSITORY } from './streaks.repository';
import { FileStreaksRepository } from './file-streaks.repository';

@Module({
  controllers: [StreaksController],
  providers: [
    StreaksService,
    {
      provide: STREAKS_REPOSITORY,
      useClass: FileStreaksRepository,
    },
  ],
})
export class StreaksModule {}
