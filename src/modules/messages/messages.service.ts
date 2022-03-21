import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { Repository } from 'typeorm';
import { ChannelsService } from '../channels/channels.service';
import { GetMessagesArgs } from './args/get-messages.args';
import { CreateMessageInput } from './inputs/create-message.input';
import { Message } from './models/message.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly channelsService: ChannelsService,
  ) {}

  /**
   * find one message
   * @param id message id
   * @returns
   */
  findOne(id: number): Promise<Message> {
    return this.messageRepository.findOne({
      where: { id },
      relations: ['channel'],
    });
  }

  /**
   * find all messages by channelId
   * @param args
   * @returns
   */
  findAll(args: GetMessagesArgs): Promise<Message[]> {
    return this.messageRepository.find({
      where: { channel: { id: args.channelId } },
      relations: ['channel'],
      take: args.size,
      skip: (args.page - 1) * args.size,
      order: { createdAt: args.orderBy },
    });
  }

  /**
   * create one message
   * @param args
   * @returns
   */
  async create(args: CreateMessageInput): Promise<Message> {
    const channel = await this.channelsService.findOne(args.channelId);
    if (!channel) {
      throw new UserInputError(
        `The channelId = ${args.channelId} is not exist`,
      );
    }
    const message = this.messageRepository.create({
      title: args.title,
      content: args.content,
      channel,
    });
    return this.messageRepository.save(message);
  }
}
