import { Controller, Get } from "@nestjs/common";


@Controller({})
    export class TaskController{

        @Get('/tasks')
        getAllTasks(){
            return "lista de tasks"
        }

    }