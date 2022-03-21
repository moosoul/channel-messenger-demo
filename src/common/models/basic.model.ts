import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class BasicModel {
  @Field(() => Int, { description: 'Unique Id' })
  @PrimaryGeneratedColumn()
  id: number;
}
