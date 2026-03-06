import express from 'express';
import userRoutes from '~/routes/users.routes';
import databaseService from './services/database.services';
import cookieParser from 'cookie-parser'
import { defaultErrorHandler } from './middlewares/error.middlewares';
import mediasRoutes from './routes/media.routes';
import { initFolder } from './utils/file';
import cors from 'cors'
import staticRoutes from './routes/static.routes';
import { UPLOAD_VIDEO_DIR } from './constants/dir';

// import postsRoutes from './routes/post.routes';
import bookMarkRoutes from './routes/bookmarks.routes';
import likeroutes from './routes/like.routes';
import postsRoutes from './routes/post.routes';
const app = express()
const port = 4000
initFolder()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
})
app.use("/users", userRoutes)
app.use('/medias', mediasRoutes)
app.use('/static', staticRoutes)
app.use('static/video_stream', express.static(UPLOAD_VIDEO_DIR))
app.use('/posts',postsRoutes)
app.use('/bookmarks',bookMarkRoutes)
app.use('/likes',likeroutes)
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
