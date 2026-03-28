import express from 'express';
import databaseService from './services/database.services';
import cookieParser from 'cookie-parser'
import { defaultErrorHandler } from './middlewares/error.middlewares';
import cors from 'cors'
import rootRouter from './routes/index.routes';


const app = express()
const port = 4000
app.use(cors())
app.use(cookieParser())
app.use(express.json())
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
})
app.use("/", rootRouter)
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
