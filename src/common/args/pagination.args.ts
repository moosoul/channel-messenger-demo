import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 1,
    nullable: true,
    description: 'The pagination page default is 1 and min is 1',
  })
  @Min(1)
  page?: number = 1;

  @Field(() => Int, {
    defaultValue: 10,
    nullable: true,
    description: 'The pagination size default is 10 and min is 1 max is 100',
  })
  @Min(1)
  @Max(100)
  size?: number = 10;
}
