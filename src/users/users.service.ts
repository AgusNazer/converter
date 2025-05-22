import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/model/user.entity';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find(); // trae todos los usuarios
  }

  getUsersById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id }); // busca usuario por id
  }

async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.passwordHash = await bcrypt.hash(dto.password, 10);

    return this.usersRepository.save(user);
  }

  async deleteUserById(id: number): Promise<void>{
    await this.usersRepository.delete(id);
  }

  //crear usuaarios simlataneamente
async createUsersBulk(dtos: CreateUserDto[]): Promise<User[]> {
  const users = await Promise.all(
    dtos.map(async (dto) => {
      if (!dto.password) {
        throw new Error('Password missing in one of the users');
      }
      const user = new User();
      user.name = dto.name;
      user.email = dto.email;
      user.passwordHash = await bcrypt.hash(dto.password, 10);
      return user;
    }),
  );

  return this.usersRepository.save(users);
}



  
}