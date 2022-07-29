import { Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  create(createTaskDto: CreateTaskDto, userId: string) {
    const created_at = new Date();
    const updated_at = created_at;

    const newTask = new this.taskModel({
      ...createTaskDto,
      created_at,
      updated_at,
      user:userId
    }).save();

    return newTask;
  }

  findAll(userdId: string) {
    return this.taskModel.find({ user: userdId });
  }

  findOne(id: string) {
    return this.taskModel.findOne({ _id: id });
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    const updated_at = new Date();

    return this.taskModel.findByIdAndUpdate(
      {
        _id: id,
      },
      { ...updateTaskDto, updated_at },
      { new: true },
    );
  }

  remove(id: string) {
    return this.taskModel.deleteOne({ _id: id }).exec();
  }
}
