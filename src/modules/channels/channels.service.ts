import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInputError } from 'apollo-server-express';
import { Repository } from 'typeorm';
import { CreateChannelInput } from './inputs/create-channel.input';
import { Channel } from './models/channel.model';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  /**
   *
   * @param id channel id
   * @returns
   */
  findOne(id: number): Promise<Channel> {
    return this.channelRepository.findOne({ where: { id } });
  }

  /**
   *
   * @param name channel name
   * @returns
   */
  findOneByName(name: string): Promise<Channel> {
    return this.channelRepository.findOneBy({ name });
  }

  /**
   * create one
   * @param args
   * @returns
   */
  async create(args: CreateChannelInput): Promise<Channel> {
    let channel = await this.findOneByName(args.name);
    if (channel) {
      throw new UserInputError(
        `The channel name = ${args.name} has been created, please change it`,
      );
    }
    channel = this.channelRepository.create({ name: args.name });
    return await this.channelRepository.save(channel);
  }
}
