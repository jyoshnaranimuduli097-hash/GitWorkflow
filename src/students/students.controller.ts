import { Controller, Get, Param,Body, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './DTO/createSudent.dto.js'
import { AccessTokenGuardGuard } from '../auth/guards/access-token-guard/access-token-guard.guard.js';

@Controller('students')
export class StudentsController {

    constructor(private readonly studentService : StudentsService){}
    // @UseGuards(AccessTokenGuardGuard)
    @Get()
    getStudent(){
        return this.studentService.getStudent()
    }

    @Get(":id")
    getStudentById(@Param("id",ParseIntPipe) id : number ){
        return `get student id ${id}: ${typeof(id)}`
    }

    @Post()
    createStudent(@Body() data : CreateStudentDto){
       return this.studentService.createStudent(data)
    }

}
