import { pick } from "lodash"
import { Request, Response, NextFunction } from "express"
export const filterMiddleware = (fillterKey: string[]) => (req: Request, res: Response, next: NextFunction )=> {
  req.body = pick(req.body, fillterKey)
  next()
}