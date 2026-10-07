import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './DTO/createSudent.dto.js';

@Injectable()
export class StudentsService {
    private students : CreateStudentDto[] = [
        {name:"ume",roll_no:"23",age:21},
        {name:"chumi",roll_no:"65",age:2}
    ]

    createStudent(data:CreateStudentDto){
         this.students.push(data);
        return data
    }

    getStudent(){
        let data = this.students
        return data
    }

}
