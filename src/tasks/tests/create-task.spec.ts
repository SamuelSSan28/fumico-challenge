import {
  ArgumentMetadata,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../../auth/auth.module';
import * as request from 'supertest';
import { TasksModule } from '../tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test-utils/mongo/MongooseTestModule';
import { User, UserSchema } from '../../users/entities/user.entity';
import { Task, TaskSchema } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

let app: INestApplication;
let token: string;
let server: any;

const task = {
  title: 'fazer desafio fumico',
  description: 'fazer desafio fumico',
};

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      AuthModule,
      TasksModule,
    ],
  }).compile();
  app = module.createNestApplication();
  await app.init();
  server = app.getHttpServer();

  await request(server)
    .post('/users')
    .send({
      email: 'test1@test.com',
      password: '12345678',
    })
    .expect(201);

  const login1 = await request(server)
    .post('/auth/login')
    .send({
      email: 'test1@test.com',
      password: '12345678',
    })
    .expect(200);
  const { access_token } = JSON.parse(login1.text);
  token = access_token;
});

afterAll(async () => {
  await closeInMongodConnection();
  await app.close();
  server.close();
});

describe('Create Tasks', () => {
  it('Não deve ser possivel criar uma task sem o token de autenticação', async () => {
    return await request(server).post('/tasks').send(task).expect(401);
  });

  //it('Não deve ser possivel criar uma task sem o campo description', async () => {});

  //it('Não deve ser possivel criar uma task sem o campo title', async () => {});

  it('Deve ser possivel criar uma task passando os campos obrigatorios e com o usuario logado', async () => {
    return await request(server)
      .post('/tasks')
      .send(task)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  });
});
