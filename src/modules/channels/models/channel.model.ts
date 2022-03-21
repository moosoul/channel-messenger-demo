import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BasicModel } from '../../../common/models/basic.model';

@ObjectType()
@Entity({ name: 'channels' })
export class Channel extends BasicModel {
  @Field({ description: 'The channel name' })
  @Column({ type: 'varchar', unique: true, comment: 'The channel name' })
  name: string;
}
