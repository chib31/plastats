import { Controller, Get, Query } from '@nestjs/common';
import { BattingQueryDto } from './dto/batting-query.dto';
import { BowlingQueryDto } from './dto/bowling-query.dto';
import { StatsService } from './stats.service';

@Controller()
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get('batting')
  getBatting(@Query() q: BattingQueryDto) {
    return this.stats.getBatting({
      page: q.page ?? 1,
      pageSize: q.pageSize ?? 50,
      sort: q.sort ?? 'runs',
      order: q.order ?? 'desc',
    });
  }

  @Get('bowling')
  getBowling(@Query() q: BowlingQueryDto) {
    return this.stats.getBowling({
      page: q.page ?? 1,
      pageSize: q.pageSize ?? 50,
      sort: q.sort ?? 'wickets',
      order: q.order ?? 'desc',
    });
  }
}
