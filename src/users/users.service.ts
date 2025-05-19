import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAllUsers(): string {
    return 'haciendo get a users...';
  }
  getUsersById(): string {
    return 'Usuarios por Id'
  }

}
