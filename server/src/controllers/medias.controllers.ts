import { Request, Response } from 'express'
import { mediaMessages } from '~/constants/messages'
import mediasService from '~/services/medias.services'


export const uploadMediaController = (folder: 'images' | 'videos' | 'documents') => {
  return async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File
    if (!file) return res.status(400).json({ message: mediaMessages.NOT_FOUND_FILE })
    const url = await mediasService.uploadToCloudinary(file, folder)
    
    return res.json({
      message: `Upload ${folder} thành công!`,
      result: url
    })
  }
}