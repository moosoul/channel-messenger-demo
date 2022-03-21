import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { PaginationArgs } from '../../../common/args/pagination.args';
import { OrderBy } from '../../../common/enums/order-by.enum';

@ArgsType()
export class GetMessagesArgs extends PaginationArgs {
  @Field(() => Int, { description: 'The channel Id' })
  channelId: number;

  @Field(() => OrderBy, {
    defaultValue: OrderBy.DESC,
    description: 'The message sort with createdAt and order by',
  })
  orderBy?: OrderBy = OrderBy.DESC;
}
