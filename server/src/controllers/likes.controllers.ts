import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LikePostReqBody } from '~/models/requests/Like.requets'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/like.services'
import { postMessages } from '~/constants/messages'



export const likeTweetController =async (req: Request<ParamsDictionary, any, LikePostReqBody>, res: Response) => {
      const { user_id } = req.decoded_access_token as TokenPayload
    
      const { post_id } = req.body
      const result =  await likeService.likePost(user_id, post_id)
      return res.json({
        message: postMessages.POST_LIKE_SUCCESS,
        result
      })
      

}
export const unlikeTweetController = async(req: Request<ParamsDictionary, any, LikePostReqBody>, res: Response) => {
      const { user_id } = req.decoded_access_token as TokenPayload
      const { post_id } = req.body
      const result = await likeService.UnlikePost(user_id, post_id)
      return res.json({
        message: postMessages.POST_UNLIKE_SUCCESS,
        result
      })
}
