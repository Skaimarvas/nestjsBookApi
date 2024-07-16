import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  findOne(userName: string): Promise<User> {
    return this.usersRepository.findOne({ where: { userName } });
  }
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(
    userName: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const newUser = this.usersRepository.create({
      userName,
      email,
      password,
      firstName,
      lastName,
    });

    return this.usersRepository.save(newUser).catch((error) => error.message);
  }
}
