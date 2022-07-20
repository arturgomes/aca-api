import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Student } from "../entity/Student";
/**
 * I've created a very simple set of methods for 
 * the api.
 * Honestly, I'm focusing on the challenge of learning Vue.JS, therefore, 
 * I'm making simple input validation, but one can improve it can be made using Yup or Joi. 
 * These can be done with a bit more of time.
 * 
 * I'm not using specific status code for response, just chosed 401 and 200 
 * in order to distinguish between a completed or faulty request
 */
export default {

  async all(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    const res = await studentRepository.find();
    if(!res){
      return response.status(401).json({message:"could not find any student"})
    }
    return response.status(200).json(res)
  },

  async one(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    const res = await studentRepository.findOne(request.params.ra);
    if(!res){
      return response.status(401).json({message:"could not find any student"})
    }
    return response.status(200).json(res)
  },

  async create(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    if(!request.body.student?.email) {
      return response.status(404).json({
        msg: 'Invalid value', param: 'email', location: 'body'
      })
    }
    if(!request.body.student?.cpf ){
      return response.status(404).json({
        msg: 'Invalid value', param: 'cpf', location: 'body'
      })
    }
    if(!request.body.student?.name){
      return response.status(404).json({
        msg: 'Invalid value', param: 'name', location: 'body'
      })
    }

    const {student} = request.body
    const existing = await studentRepository.findOne({email:student.email});
    if(existing){
      return response.status(401).json({message:"Student already exists"})
    }
    const res = await studentRepository.save(student);
    if(res){
      return response.status(200).json({message:"student created successfully"})
    }
    return response.status(201).json({message:"could not create new student"})
  },
  async save(request: Request, response: Response) {
    if(!request.body.email) {
      return response.status(404).json({
        msg: 'Invalid value', param: 'email', location: 'body'
      })
    }
    if(!request.body.name){
      return response.status(404).json({
        msg: 'Invalid value', param: 'name', location: 'body'
      })
    }
    const studentRepository = getRepository(Student);
    let student = await studentRepository.findOne({ ra: request.params.ra })
    const {name,email} = request.body
    student.name = name
    student.email = email
    const res = await studentRepository.save(student);
    if(res){
      return response.status(200).json({message:"student updated successfully"})
    }
    return response.status(201).json({message:"could not update student"})
  },

  async remove(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    let studentToRemove = await studentRepository.findOne(request.params.id);
    if (!studentToRemove) 
      return response.status(201).json({message:"could not delete student"})
    const res =  await studentRepository.remove(studentToRemove);
    return response.status(200).json({message:"student deleted successfully"})
  }
}
