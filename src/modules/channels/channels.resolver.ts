import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { MessagesService } from '../messages/messages.service';
import { Message } from '../messages/models/message.model';
import { ChannelsService } from './channels.service';
import { CreateChannelInput } from './inputs/create-channel.input';
import { Channel } from './models/channel.model';

@Resolver(() => Channel)
export class ChannelsResolver {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Query(() => Channel, { description: 'find one channel by id' })
  async channel(@Args('id', { type: () => Int }) id: number) {
    return this.channelsService.findOne(id);
  }

  @Mutation(() => Channel, { description: 'create one channel' })
  async createChannel(@Args('args') args: CreateChannelInput) {
    return this.channelsService.create(args);
  }

  @ResolveField('messages', () => [Message], {
    defaultValue: [],
    description: `The channel's messages, if no message will return empty array`,
  })
  async getMessages(@Parent() channel: Channel) {
    return await this.messagesService.findAll({
      channelId: channel.id,
    });
  }
}
