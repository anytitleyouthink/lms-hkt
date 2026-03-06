import { Router } from 'express'
import { serveImageController, serveM3u8Controller, serveSegmentController, serveVideoStreamController } from '~/controllers/medias.controllers'

const staticRoutes = Router()

staticRoutes.get('/image/:name', serveImageController)
staticRoutes.get('/video_stream/:name', serveVideoStreamController)
staticRoutes.get('/video_stream_hls/:id/master.m3u8', serveM3u8Controller)
staticRoutes.get('/video_stream_hls/:id/:v/:segment', serveSegmentController)

export default staticRoutes