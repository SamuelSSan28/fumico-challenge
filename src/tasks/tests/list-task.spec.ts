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

const task2 = {
  title: 'fazer desafio fumico2',
  description: 'fazer desafio fumico2',
};

const task3 = {
  title: 'fazer desafio fumico3',
  description: 'fazer desafio fumico3',
};

const tasks = [];

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

  const t1 = JSON.parse(task_created.text);
  id_valid = t1._id;

  const task_created2 = await request(server)
    .post('/tasks')
    .send(task2)
    .set('Authorization', `Bearer ${token}`)
    .expect(201);

  const t2 = JSON.parse(task_created2.text);

  const task_created3 = await request(server)
    .post('/tasks')
    .send(task3)
    .set('Authorization', `Bearer ${token}`)
    .expect(201);

  const t3 = JSON.parse(task_created3.text);

  tasks.push(t1);
  tasks.push(t2);
  tasks.push(t3);
});

afterAll(async () => {
  await closeInMongodConnection();
  await app.close();
  server.close();
});

describe('List Tasks', () => {
  it('Não deve ser possivel listar as task sem o usuario logado', async () => {
    return await request(server).get(`/tasks`).send(task).expect(401);
  });

  it('Deve ser possivel listar as tasks com o usuario logado', async () => {
    const get_request = await request(server)
      .get(`/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const get_result = JSON.parse(get_request.text);

    expect(get_result).toEqual(tasks);
  });

  it('Não deve ser possivel listar uma task que não existe com o usuario logado', async () => {
    const get_request = await request(server)
      .get(`/tasks/${id_invalid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    return expect(get_request.text).toEqual('');
  });
});
