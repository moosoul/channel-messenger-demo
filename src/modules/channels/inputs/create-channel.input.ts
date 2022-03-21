import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChannelInput {
  @Field({ description: 'The channel name need unique' })
  name: string;
}
