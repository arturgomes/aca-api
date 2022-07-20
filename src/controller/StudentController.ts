import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { Student } from "../entity/Student";

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