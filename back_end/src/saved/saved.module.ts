import { SavedController } from './saved.controller';
import { SavedService } from './saved.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule {}
