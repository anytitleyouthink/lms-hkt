import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { courseMessages, progressMessages } from '~/constants/messages'
import databaseService from '~/services/database.services'
import sectionsService from '~/services/sections.services'
import { CreateSectionReqBody } from '~/validations/sections.validation'

export const createSectionController = async (
  req: Request<any, any, CreateSectionReqBody>,
  res: Response
) => {
  const result = await sectionsService.createSection(req.body)
  return res.json({
    message: courseMessages.SECTION_CREATED_SUCCESS,
    result
  })
}

export const updateSectionController = async (req: Request, res: Response) => {
  const { section_id } = req.params;
  const result = await sectionsService.updateSection(section_id, req.body);
  if (!result) return res.status(404).json({ message: "Section not found" });
  return res.json({ message: courseMessages.SECTION_UPDATED_SUCCESS || "Section updated successfully", result });
};


export const deleteSectionController = async (req: Request, res: Response) => {
  const { section_id } = req.params;

  try {
    // 1. Tìm Section để lấy thông tin order và course_id
    const section = await databaseService.sections.findOne({ 
      _id: new ObjectId(section_id) 
    });
    
    if (!section) {
      return res.status(404).json({ message: progressMessages.SECTION_NOT_FOUND   });
    }

    const deletedOrder = section.order;
    const courseId = section.course_id;

    // 2. DỌN RÁC (Quan trọng): Xóa TẤT CẢ Lesson thuộc về Section này
    await databaseService.lessons.deleteMany({ 
      section_id: new ObjectId(section_id) 
    });

    // 3. Xóa chính Section đó
    await databaseService.sections.deleteOne({ _id: new ObjectId(section_id) });

    // 4. RE-INDEXING: Cập nhật lại các Section đứng sau trong cùng khóa học
    await databaseService.sections.updateMany(
      { 
        course_id: new ObjectId(courseId), 
        order: { $gt: deletedOrder } 
      },
      { 
        $inc: { order: -1 } 
      } 
    );

    return res.json({ message: courseMessages.SECTION_DELETED_SUCCESS });
  } catch (error) {
    console.error("Error in deleteSectionController:", error);
    return res.status(500).json({ message: courseMessages.ERROR_SERVER   });
  }
};