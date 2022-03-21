import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelsService } from './channels.service';
import { Channel } from './models/channel.model';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

const repositoryMockFactory: () => MockType<Repository<Channel>> = jest.fn(
  () => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }),
);

describe('ChannelsService', () => {
  let service: ChannelsService;
  let repositoryMock: MockType<Repository<Channel>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
    repositoryMock = module.get(getRepositoryToken(Channel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne channel', async () => {
    const channel = { name: 'test_channel', id: 1 };
    repositoryMock.findOne.mockReturnValue(channel);
    expect(await service.findOne(channel.id)).toEqual(channel);
  });

  it('findOne chanel by name', async () => {
    const channel = { name: 'test_channel', id: 1 };
    repositoryMock.findOneBy.mockReturnValue(channel);
    expect(await service.findOneByName(channel.name)).toEqual(channel);
  });

  it('createOne channel', async () => {
    const channel = { name: 'test_channel', id: 1 };
    repositoryMock.create.mockReturnValue(channel);
    repositoryMock.save.mockReturnValue(channel);
    expect(await service.create({ name: channel.name })).toEqual(channel);
  });
});
