import { Request, Response } from 'express'
import { BookmarkPostReqBody } from '~/models/requests/Bookmark.requets'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarksService from '~/services/bookmarks.services'
import { postMessages } from '~/constants/messages'
import { ParamsDictionary } from 'express-serve-static-core'


export const bookmarkPostController = async (req: Request<ParamsDictionary, any, BookmarkPostReqBody>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const { post_id } = req.body as BookmarkPostReqBody
  const result = await bookmarksService.bookmarkPost(user_id, post_id)
  return res.json({
    message: postMessages.BOOKMARK_POST_SUCCESS,
    result
  })
}
export const unbookmarkPostController = async (req: Request<ParamsDictionary, any, BookmarkPostReqBody>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const { post_id } = req.params 
  const result = await bookmarksService.unbookmarkPost(user_id, post_id)
  return res.json({
    message: postMessages.UNBOOKMARK_POST_SUCCESS,
    result
  })

  
}