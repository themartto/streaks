import { Controller, Get, Param } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streakService: StreaksService) {}

  @Get(':id')
  getStreakCase(@Param('id') caseId: number) {
    return this.streakService.triggerStreakCase(caseId);
  }
}
