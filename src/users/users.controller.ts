import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "src/model/user.entity";

@Controller('/users')
export class UsersController{
    constructor(private readonly usersService: UsersService){} 

    @Get()
    getAllUsers(): Promise<User[]>{
        return this.usersService.getAllUsers();

    }
    @Get(':id')
    getUsersById(@Param('id') id: string): Promise<User>{
        return this.usersService.getUsersById(+id);
    }

    @Post()
  createUser(@Body() data: Partial<User>): Promise<User> {
    return this.usersService.createUser(data);
  }

}
