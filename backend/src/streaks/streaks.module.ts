import { Module } from '@nestjs/common';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';
import { STREAKS_GATEWAY } from './streaks.gateway';
import { FileStreaks } from './file-streaks';

@Module({
  controllers: [StreaksController],
  providers: [
    StreaksService,
    {
      provide: STREAKS_GATEWAY,
      useClass: FileStreaks,
    },
  ],
})
export class StreaksModule {}
