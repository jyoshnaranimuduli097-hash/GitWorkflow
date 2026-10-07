import { IsString,IsInt } from "class-validator";


export class CreateStudentDto{
@IsString()    
name:string;
@IsString()  
roll_no:string;
@IsInt()  
age:number
}