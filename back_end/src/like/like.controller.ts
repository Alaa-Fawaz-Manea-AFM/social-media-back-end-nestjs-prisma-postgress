import { Controller, Post, Req, Param, Get } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get()
  getAllLiked(@Req() req) {
    return this.likeService.getLiked(req.user.userId);
  }

  @Post(':id')
  toggleLike(@Param('id') postId: string, @Req() req) {
    return this.likeService.toggleLike(req.user.userId, postId);
  }
}
