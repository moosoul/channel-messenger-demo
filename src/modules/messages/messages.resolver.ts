import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetMessagesArgs } from './args/get-messages.args';
import { CreateMessageInput } from './inputs/create-message.input';
import { MessagesService } from './messages.service';
import { Message } from './models/message.model';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => Message, { description: 'find one message by id' })
  message(@Args('id', { type: () => Int }) id: number) {
    return this.messagesService.findOne(id);
  }

  @Query(() => [Message], { description: 'find all messages' })
  messages(@Args() args: GetMessagesArgs) {
    return this.messagesService.findAll(args);
  }

  /**
   * Create One Message
   * @param args
   * @returns
   */
  @Mutation(() => Message, { description: 'Create One Message' })
  createMessage(@Args('args') args: CreateMessageInput) {
    return this.messagesService.create(args);
  }
}
