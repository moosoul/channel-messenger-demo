import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

const clearDB = async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.query(`DROP TABLE ${entity.tableName}`);
  }
};

describe('ChannelResolver (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await clearDB();
    await app.close();
  });

  const channel = { id: 1, name: 'test_channel' };

  it('create a new channel', async () => {
    const queryData = {
      query: `mutation {
        createChannel(args: { name: "${channel.name}" }) {
          id
          name
        }
      }`,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryData);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      data: { createChannel: channel },
    });
  });

  it('find one channel by id', async () => {
    const queryData = {
      query: `query {
        channel(id: ${channel.id}) {
          id
          name
        }
      }`,
    };

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send(queryData);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      data: { channel },
    });
  });
});
