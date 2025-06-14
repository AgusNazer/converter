import { Controller, Get } from "@nestjs/common";

//completar con los demas
@Controller({})
    export class TaskController{

        @Get('/tasks')
        getAllTasks(){
            return "lista de tasks"
        }

    }