import { getRepository } from "typeorm";
import * as Yup from 'yup'
import { Response } from "express";
import CustomMessages from '../messages/Messages';
import { Student } from "../entity/Student";

/**
 * I've created a very simple set of methods for 
 * the api.
 * I'm not using specific status code for response, just chosed 400 and 200 
 * in order to distinguish between a completed or faulty request
 */
export class StudentService {
  /**
   * Find a single student in the database
   * @param ra Academic Registry
   * @param response 
   * @returns Returns a student matching `ra`
   */
  async findOneStudent(ra: string, response: Response) {
    const studentRepository = getRepository(Student);
    const res = await studentRepository.findOne(ra);
    return res ? response.status(200).json(res)
      : response.status(400).json({ error: CustomMessages.student_not_found })
  }
  /**
   * Find all students stored
   * @param response 
   * @returns all records from the database
   */
  async findAllStudent(response) {
    const studentRepository = getRepository(Student);
    const res = await studentRepository.find();
    return res ? response.status(200).json(res)
      : response.status(400).json({ error: CustomMessages.student_not_found })
  }
  /**
   * Create new student
   * @param student 
   * @param response 
   * @returns a message stating wether or not the student was creted
   */
  async createNewStudent(student, response: Response) {
    const studentRepository = getRepository(Student);
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      cpf: Yup.string().required(),
      name: Yup.string().required(),
      ra: Yup.number().required(),
    });
    if (!(await schema.isValid({
      name: student.name,
      email: student.email,
      cpf: student.cpf,
      ra: student.ra,
    }))) {
      return response.status(400).json({ error: CustomMessages.validation_failed });
    }
    const existing = await studentRepository.findOne({ email: student.email });
    if (existing) {
      return response.status(400).json({ message: CustomMessages.student_already_exists })
    }
    const res = await studentRepository.save(student);
    return res ? response.status(200).json({ message: CustomMessages.student_created })
      : response.status(400).json({ message: CustomMessages.student_already_exists })
  }
  /**
   * Update student with a given `ra` in the database 
   * @param ra 
   * @param name 
   * @param email 
   * @param response 
   * @returns a message stating wether or not the student was updated
   */
  async updateStudent(ra: number, name: string, email: string, response: Response) {
    const studentRepository = getRepository(Student);
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      name: Yup.string().required(),
    });
    if (!(await schema.isValid({ name: name, email: email, }))) {
      return response.status(400).json({ error: CustomMessages.validation_failed });
    }
    let student = await studentRepository.findOne({ ra })
    student.name = name
    student.email = email
    const res = await studentRepository.save(student);
    return res ? response.status(200).json({ message: CustomMessages.student_updated })
               : response.status(400).json({ message: CustomMessages.student_not_updated })
  }
  /**
   * Delete student with a given `ra` from the database 
   * @param ra 
   * @param response 
   * @returns 
   */
  async removeStudent(ra, response: Response) {
    const studentRepository = getRepository(Student);
    let studentToRemove = await studentRepository.findOne({ra});
    if (!studentToRemove){
      return response.status(201).json({ message: CustomMessages.student_not_found })
    }else {
      await studentRepository.remove(studentToRemove);
      return response.status(200).json({ message: CustomMessages.student_deleted })
    }
  }
}