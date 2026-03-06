import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { UPLOAD_VIDEO_DIR, UPLOAD_VIDEOHLS_DIR, UPLOAD_IMAGE_DIR} from '~/constants/dir';
import { IncomingMessage } from 'http';
import { File } from 'formidable';
import { v4 as uuidv4 } from 'uuid';

export const initFolder = () => {
  [UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEOHLS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích là để tạo folder nested
      })
    }
  })
}
 
export const handleImageUpload = (req: Request): Promise<File[]> => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 300 * 1024, // 300KB mỗi file
    maxTotalFileSize: 300 * 1024 * 4, // tổng 4 file
    filter: ({ name, mimetype }) => {
      return name === "image" && Boolean(mimetype?.startsWith("image/"))
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      const images = files.image
      if (!images) {
        return reject(new Error("File is empty"))
      }
        const fileArray: File[] = Array.isArray(images) ? images : [images]
      resolve(fileArray)
    })
  })
}
export const handleVideoUpload = (req: Request): Promise<File[]> => {


  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    keepExtensions: false,
    maxFileSize: 300* 1024* 1024, // 300KB mỗi file
    
   filter: function ({ name, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
  })

  return new Promise((resolve, reject) => {
    form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      const video = files.video
      if (!video) {
        return reject(new Error("File is empty"))
      }
        const fileArray: File[] = Array.isArray(video) ? video : [video]
      resolve(fileArray)
    })
  })
}
export const handleVideohLSUpload = (req: Request): Promise<File[]> => {
  const id = uuidv4();
  const folderPath = path.resolve(UPLOAD_VIDEOHLS_DIR, id);
  fs.mkdirSync(folderPath);

  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    keepExtensions: false,
    maxFileSize: 300* 1024* 1024, // 300KB mỗi file
    
   filter: function ({ name, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: function () {
      return id
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      const video = files.video
      if (!video) {
        return reject(new Error("File is empty"))
      }
        const fileArray: File[] = Array.isArray(video) ? video : [video]
      resolve(fileArray)
    })
  })
}

export const getFileName = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}
