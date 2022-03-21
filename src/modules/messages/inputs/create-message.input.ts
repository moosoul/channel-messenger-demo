import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field({ description: 'The message title' })
  title: string;

  @Field({ description: 'The message content' })
  content: string;

  @Field(() => Int, { description: 'The channel id' })
  channelId: number;
}
