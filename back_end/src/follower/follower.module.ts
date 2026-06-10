import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
