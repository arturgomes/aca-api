import { getRepository } from "typeorm";
import * as Yup from 'yup'
import { Request, Response } from "express";
import CustomMessages from '../messages/Messages';
import { Student } from "../entity/Student";
/**
 * I've created a very simple set of methods for 
 * the api.
 * Honestly, I'm focusing on the challenge of learning Vue.JS, therefore, 
 * I'm making simple input validation, but one can improve it can be made using Yup or Joi. 
 * These can be done with a bit more of time.
 * 
 * I'm not using specific status code for response, just chosed 400 and 200 
 * in order to distinguish between a completed or faulty request
 */
export default {

  async all(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    const res = await studentRepository.find();
    if(!res){
      return response.status(400).json({error:CustomMessages.student_not_found})
    }
    return response.status(200).json(res)
  },

  async one(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    const res = await studentRepository.findOne(request.params.ra);
    if(!res){
      return response.status(400).json({error:CustomMessages.student_not_found})
    }
    return response.status(200).json(res)
  },

  async create(request: Request, response: Response) {
    const studentRepository = getRepository(Student);
    const {student} = request.body
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      cpf: Yup.string().required(),
      name: Yup.string().required(),
      ra: Yup.number().required(),
    });
    if (
      !(await schema.isValid({
        name: student.name,
        email: student.email,
        cpf: student.cpf,
        ra: student.ra,
      }))
    ) {
      return response.status(400).json({ error: CustomMessages.validation_failed });
    }


    const existing = await studentRepository.findOne({email:student.email});
    if(existing){
      return response.status(400).json({error: CustomMessages.student_already_exists,
        message:"Student already exists"})
    }
    const res = await studentRepository.save(student);
    if(res){
      return response.status(201).json({message:"student created successfully"})
    }
    return response.status(200).json({messager: CustomMessages.student_already_exists})
  },
  async save(request: Request, response: Response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      name: Yup.string().required(),
    });
    if (
      !(await schema.isValid({
        name: request.body.name,
        email: request.body.email,
      }))
    ) {
      return response.status(400).json({ error: CustomMessages.validation_failed });
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
    let studentToRemove = await studentRepository.findOne(request.params.ra);
    if (!studentToRemove) 
      return response.status(201).json({message:"could not delete student"})
    const res =  await studentRepository.remove(studentToRemove);
    return response.status(200).json({message:"student deleted successfully"})
  }
}
