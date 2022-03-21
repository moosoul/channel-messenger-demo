import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsModule } from '../channels/channels.module';
import { MessageResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { Message } from './models/message.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => ChannelsModule),
  ],
  providers: [MessagesService, MessageResolver],
  exports: [MessagesService],
})
export class MessagesModule {}
