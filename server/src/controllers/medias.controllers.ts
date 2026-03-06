import type { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import path from "node:path";
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEOHLS_DIR } from "~/constants/dir";
import { userMessages } from "~/constants/messages";
import mediasService from "~/services/medias.services";
import fs from "node:fs";
import { StatusCodes } from "http-status-codes";
import e from "express";
import databaseService from "~/services/database.services";

export const uploadImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = await mediasService.UpLoadImage(req);
  return res.json({
    message: userMessages.UPLOAD_IMAGE_SUCCESS,
    result: url,
  });

};
export const uploadVideoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = await mediasService.UpLoadVideo(req);
  return res.json({
    message: userMessages.UPLOAD_VIDEO_SUCCESS,
    result: url,
  });
};
export const uploadVideoHLSController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = await mediasService.UpLoadVideoHls(req);
  return res.json({
    message: userMessages.UPLOAD_VIDEO_HLS_SUCCESS,
    result: url,
  });
};
export const serveM3u8Controller = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEOHLS_DIR, id, 'master.m3u8'), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }

  })
}
export const serveSegmentController = (req: Request, res: Response, next: NextFunction) => {
  const { id, v, segment } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEOHLS_DIR, id, v, segment), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
export const serveVideoStreamController = (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(400).send('Requires Range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  const videosize = fs.statSync(videoPath).size
  const chunkSize = 30 * 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videosize - 1)
  const contentLength = end - start + 1
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videosize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  }
  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers)
  const videoSteams = fs.createReadStream(videoPath, { start, end })
  videoSteams.pipe(res)
}
export const videoStatusController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const videoStatus = await mediasService.getVideoStatus(id)
  if (!videoStatus) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: userMessages.VIDEO_NOT_FOUND
    })

  }
  return res.json({
    message: userMessages.GET_VIDEO_STATUS_SUCCESS,
    result: videoStatus
  })

}