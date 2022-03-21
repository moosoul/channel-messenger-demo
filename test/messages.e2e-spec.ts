import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection, getRepository } from 'typeorm';
import { Channel } from '../src/modules/channels/models/channel.model';
import { Message } from '../src/modules/messages/models/message.model';

const clearDB = async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
};

const importData = async () => {
  await clearDB();
  const channelRepository = getRepository(Channel);
  const messageRepository = getRepository(Message);
  let channel = await channelRepository.findOne({ where: { id: 1 } });
  if (!channel) {
    channel = channelRepository.create({ name: 'test message channel' });
    channel = await channelRepository.save(channel);
  }

  const messages: Message[] = [];
  // add five message
  for (let i = 0; i < 5; i++) {
    let message = messageRepository.create({
      title: 'test message',
      content: 'test content',
      channel,
    });
    message = await messageRepository.save({
      title: `test message ${i}`,
      content: `test content ${i}`,
      channel,
    });
    messages.push(message);
  }

  return messages[0];
};

describe('ChannelResolver (e2e)', () => {
  let app: INestApplication;
  let message: Message;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    message = await importData();
  });

  afterAll(async () => {
    await clearDB();
    await app.close();
  });

  it('create a new message', async () => {
    const queryData = {
      query: `mutation {
        createMessage(args: { title: "${message.title}", content: "${message.content}", channelId: ${message.channel.id} }) {
          title
          content
          channel {
            id
            name
          }
        }
      }`,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryData);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      data: {
        createMessage: {
          title: message.title,
          content: message.content,
          channel: message.channel,
        },
      },
    });
  });

  it('find one message by id', async () => {
    const queryData = {
      query: `query {
        message(id: ${message.id}) {
          id
          title
          content
          channel {
            id
            name
          }
        }
      }`,
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryData);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      data: {
        message: {
          id: message.id,
          title: message.title,
          content: message.content,
          channel: {
            id: message.channel.id,
            name: message.channel.name,
          },
        },
      },
    });
  });

  it('find All messages', async () => {
    const queryData = {
      query: `query {
        messages(channelId:${message.channel.id}) {
          id
          title
          content
        }
      }`,
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryData);
    expect(res.status).toEqual(200);
    expect(res.body.data.messages.length).toEqual(5);
  });

  it('find All messages pagination', async () => {
    const queryData = {
      query: `query {
        messages(channelId:${message.channel.id}, page: 1, size: 3) {
          id
          title
          content
        }
      }`,
    };
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryData);
    expect(res.status).toEqual(200);
    expect(res.body.data.messages.length).toEqual(3);
  });
});
