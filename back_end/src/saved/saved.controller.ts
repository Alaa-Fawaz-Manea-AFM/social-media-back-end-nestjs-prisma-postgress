import {
  ParseUUIDPipe,
  Controller,
  Param,
  Query,
  Post,
  Req,
  Get,
} from '@nestjs/common';
import QueryPageDto from '../validators/queryPageDto';
import { SavedService } from './saved.service';

@Controller('saves')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Get()
  getAllSaved(@Query() query: QueryPageDto, @Req() req: any) {
    return this.savedService.getSaved(query, req.user.userId);
  }

  @Post(':id')
  toggleSaved(@Param('id', ParseUUIDPipe) postId: string, @Req() req: any) {
    return this.savedService.toggleSaved(req.user.userId, postId);
  }
}
