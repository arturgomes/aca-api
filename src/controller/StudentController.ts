import { Request, Response } from "express";
import { StudentService } from "../services/StudentService";

const studentService = new StudentService()

export default {

  async all(request: Request, response: Response) {
   return await studentService.findAllStudent(response);
  },

  async one(request: Request, response: Response) {
   return await studentService.findOneStudent(request.params.ra, response);
  },

  async create(request: Request, response: Response) {
       return await studentService.createNewStudent(request.body.student, response)
  },
  
  async save(request: Request, response: Response) {
    return await studentService.updateStudent(request.params.ra, request.body.name,request.body.email, response)
  },

  async remove(request: Request, response: Response) {
    return await studentService.removeStudent(request.params.ra, response)
  }
}
