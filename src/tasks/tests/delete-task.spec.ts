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
let id_valid: string;
let server: any;

const task = {
  title: 'fazer desafio fumico',
  description: 'fazer desafio fumico',
};

const id_invalid = '62e0a81e02e3c6cbd361e58a';

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

  const task_created = await request(server)
    .post('/tasks')
    .send(task)
    .set('Authorization', `Bearer ${token}`)
    .expect(201);

  const { _id } = JSON.parse(task_created.text);
  id_valid = _id;
});

afterAll(async () => {
  await closeInMongodConnection();
  await app.close();
  server.close();
});

describe('Delete Tasks', () => {
  it('Não deve ser possivel deletar uma task sem o usuario logado', async () => {
    return await request(server)
      .delete(`/tasks/${id_valid}`)
      .send(task)
      .expect(401);
  });

  it('Deve ser possivel deletar uma task que existe com o usuario logado', async () => {
    const delete_request = await request(server)
      .delete(`/tasks/${id_valid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const delete_result = JSON.parse(delete_request.text);

    return expect(delete_result).toEqual({
      acknowledged: true,
      deletedCount: 1,
    });
  });

  it('Não deve ser possivel deletar uma task que não existe com o usuario logado', async () => {
    const delete_request = await request(server)
      .delete(`/tasks/${id_invalid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const delete_result = JSON.parse(delete_request.text);

    return expect(delete_result).toEqual({
      acknowledged: true,
      deletedCount: 0,
    });
  });
});
