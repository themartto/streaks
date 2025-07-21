import { Controller, Get, Param } from '@nestjs/common';
import { StreaksService, StreakSummary } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streakService: StreaksService) {}

  @Get(':id')
  getStreakCase(@Param('id') date: string): StreakSummary {
    return this.streakService.triggerStreakCase(date);
  }
}
