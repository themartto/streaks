import { Module } from '@nestjs/common';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { USER_DATA_GATEWAY } from './user-data.gateway';
import { StreaksFromFile } from './streaks-from-file';

@Module({
  controllers: [StreaksController],
  providers: [
    StreaksService,
    {
      provide: USER_DATA_GATEWAY,
      useClass: StreaksFromFile,
    },
  ],
})
export class StreaksModule {}
