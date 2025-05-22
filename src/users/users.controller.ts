import { Controller, Get, Post, Delete, Param, Body } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "src/model/user.entity";
import { CreateUserDto } from "./create-user.dto";
import { log } from "console";

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
  createUser(@Body() dto: CreateUserDto){
    console.log(dto, ":dto");
      if (!dto) {
    return 'No se recibió body';
  }
    
    return this.usersService.createUser(dto);
  }
//cerar suuarios ismulateaneamente
@Post('bulk')
createUsersBulk(@Body() dtos: CreateUserDto[]) {
  console.log(dtos, ':dto');
  if (!dtos || !Array.isArray(dtos)) {
    return 'Se esperaba un array de usuarios';
  }
  return this.usersService.createUsersBulk(dtos);
}


@Delete(':id')
async deleteUserById(@Param('id') id: string): Promise<{ message: string }> {
  await this.usersService.deleteUserById(+id);
  return { message: `Usuario con id ${id} borrado satisfactoriamente` };
}

}
