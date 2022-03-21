import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelsService } from '../channels/channels.service';
import { Channel } from '../channels/models/channel.model';
import { MessagesService } from './messages.service';
import { Message } from './models/message.model';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

const repositoryChannelMockFactory: () => MockType<Repository<Channel>> =
  jest.fn(() => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }));

const repositoryMessageMockFactory: () => MockType<Repository<Message>> =
  jest.fn(() => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  }));

describe('MessagesService', () => {
  let service: MessagesService;
  let repositoryMessageMock: MockType<Repository<Message>>;
  let repositoryChannelMock: MockType<Repository<Channel>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        MessagesService,
        {
          provide: getRepositoryToken(Channel),
          useFactory: repositoryChannelMockFactory,
        },
        {
          provide: getRepositoryToken(Message),
          useFactory: repositoryMessageMockFactory,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    repositoryMessageMock = module.get(getRepositoryToken(Message));
    repositoryChannelMock = module.get(getRepositoryToken(Channel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne message', async () => {
    const message = {
      id: 1,
      title: 'test message',
      content: 'test content',
      channel: { id: 1, name: 'test channel' },
      createdAt: new Date(),
    };
    repositoryMessageMock.findOne.mockReturnValue(message);
    expect(await service.findOne(message.id)).toEqual(message);
  });

  it('createOne message', async () => {
    const channel = { id: 1, name: 'test channel' };
    const message = {
      id: 1,
      title: 'test message',
      content: 'test content',
      channel,
      createdAt: new Date(),
    };
    repositoryMessageMock.create.mockReturnValue(message);
    repositoryMessageMock.save.mockReturnValue(message);
    repositoryChannelMock.findOne.mockReturnValue(channel);
    expect(
      await service.create({
        title: message.title,
        content: message.content,
        channelId: message.channel.id,
      }),
    ).toEqual(message);
  });

  it('findAll messages', async () => {
    const messages = [
      {
        id: 1,
        title: 'test message 1',
        content: 'test content 1',
        channel: { id: 1, name: 'test channel' },
        createdAt: new Date(),
      },
      {
        id: 2,
        title: 'test message 2',
        content: 'test content 2',
        channel: { id: 1, name: 'test channel' },
        createdAt: new Date(),
      },
    ];
    repositoryMessageMock.find.mockReturnValue(messages);
    expect(await service.findAll({ channelId: 1 })).toEqual(messages);
  });
});
