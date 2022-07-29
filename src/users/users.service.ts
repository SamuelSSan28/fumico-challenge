import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import hashPassword from '../utils/hashPassword';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const created_at = new Date();

    const userExists = await this.findOneByEmail(email);
    if (userExists)
      throw new BadRequestException({ message: 'User alredy exists!' });

    const newUser = new this.userModel({
      email,
      password: hashPassword(password),
      created_at,
      updated_at: created_at,
    }).save();

    return newUser;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updated_at = new Date();

    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      { ...updateUserDto, updated_at },
      { new: true },
    );
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
