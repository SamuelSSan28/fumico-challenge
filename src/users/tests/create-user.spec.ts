import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../../auth/auth.module';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { User, UserSchema } from '../../users/entities/user.entity';

let app: INestApplication;
let server: any;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      AuthModule,
    ],
  }).compile();
  app = module.createNestApplication();
  await app.init();
  server = app.getHttpServer();
});

afterAll(async () => {
  await closeInMongodConnection();
  await app.close();
  server.close();
});

describe('Create User', () => {
  //it('Não deve ser possivel criar um usuario sem o campo email', async () => {});

  //it('Não deve ser possivel criar um usuario com um email invalido', async () => {});

  //it('Não deve ser possivel criar um usuario sem o campo senha', async () => {});

  it('Deve ser possivel criar um usuário passando os campos obrigatorios', async () => {
    return await request(server)
      .post('/users')
      .send({
        email: 'test1@test.com',
        password: '12345678',
      })
      .expect(201);
  });
});
