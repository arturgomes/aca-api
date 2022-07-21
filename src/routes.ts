import StudentController from "./controller/StudentController";
import { Router } from 'express';

/**
 * I'm using this very basic set of routes for the api, nothing fancy for now
 */

const studentRoutes = Router();

studentRoutes.get("/student", StudentController.all)
studentRoutes.get("/student/:ra", StudentController.one)
studentRoutes.post("/student/create", StudentController.create)
studentRoutes.post("/student/update/:ra", StudentController.save)
studentRoutes.delete("/student/:ra", StudentController.remove)

export default studentRoutes;
