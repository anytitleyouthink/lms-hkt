import { enrollmentMessages } from "~/constants/messages";
import databaseService from "./database.services";
import Enrollment from "~/models/schemas/Enrollment.schema";
import { ObjectId } from "mongodb";
import { ErrorResponse } from "~/models/Errors";

class EnrollmentService {
  async requestEnrollment(user_id: string, course_id: string) {
     const existing = await databaseService.enrollments.findOne({
      user_id: new ObjectId(user_id),
      course_id: new ObjectId(course_id)
    });

    if (existing) {
      throw new ErrorResponse(enrollmentMessages.ENROLLMENT_EXISTS, 400);
    }

    const newEnrollment = new Enrollment({
      user_id: new ObjectId(user_id),
      course_id: new ObjectId(course_id)
    });

    await databaseService.enrollments.insertOne(newEnrollment);
    
    return newEnrollment;
  }

    
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;
