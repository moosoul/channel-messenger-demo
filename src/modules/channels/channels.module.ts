import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from '../messages/messages.module';
import { ChannelsResolver } from './channels.resolver';
import { ChannelsService } from './channels.service';
import { Channel } from './models/channel.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    forwardRef(() => MessagesModule),
  ],
  providers: [ChannelsService, ChannelsResolver],
  exports: [ChannelsService],
})
export class ChannelsModule {}
