import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BasicModel } from '../../../common/models/basic.model';
import { Channel } from '../../channels/models/channel.model';

@ObjectType()
@Entity({ name: 'messages' })
export class Message extends BasicModel {
  @Field({ description: 'The message title' })
  @Column({ type: 'varchar', comment: 'The message title' })
  title: string;

  @Field({ description: 'The message content' })
  @Column({ type: 'text', comment: 'The message content' })
  content: string;

  @Field({ description: 'The message channel' })
  @ManyToOne(() => Channel, {
    createForeignKeyConstraints: Boolean(process.env.DATABASE_FOREIGN_KEY),
  })
  @JoinColumn({ name: 'channelId', referencedColumnName: 'id' })
  channel: Channel;

  channelId: number;

  @Field({
    description: 'The message created time default is now',
    nullable: true,
  })
  @CreateDateColumn({ comment: 'The message created time default is now' })
  createdAt?: Date;
}
