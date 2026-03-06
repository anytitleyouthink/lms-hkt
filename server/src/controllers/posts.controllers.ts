 import { Request, Response } from 'express'
 import { ParamsDictionary } from 'express-serve-static-core'
import { PostsRequestBody } from '~/validations/posts.schema'
import { postMessages } from '~/constants/messages'
 import { TokenPayload } from '~/models/requests/User.requests'
import postsService from '~/services/posts.services'
import { PostType } from '~/constants/enums'

 export const createPostController = async (req: Request<ParamsDictionary, any, PostsRequestBody>, res: Response) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await postsService.createPost(user_id, req.body) 
  return res.json({
    message:  postMessages.CREATE_POST_SUCCESS,
    result 
  })
}
export const getPostController = async(req: Request, res: Response)=>{

  const { post_id } = req.params
  const result = await postsService.increseView( post_id, req.decoded_access_token ? (req.decoded_access_token as TokenPayload).user_id : undefined)
  const post = {
    ...req.post,
    user_views: result.user_views,
    guest_views: result.guest_views,
    views: result.user_views + result.guest_views,
    updated_at: result.updated_at
  }
  return res.json({
    message: postMessages.GET_POST_SUCCESS,
    result : post
  })

}
export const getPostChildrenController = async(req: Request, res: Response)=>{

  const { post_id } = req.params
  const { post_type, limit, page } = req.query as { post_type?: string; limit: string; page: string; }
  const result = await postsService.getPostChildren({post_id,post_type: Number(post_type), limit: Number(limit), page: Number(page)})
  return res.json({
    message: postMessages.GET_POST_CHILDREN_SUCCESS,
    result : {
      posts: result.result,
      post_type: post_type ? Number(post_type) : undefined,
      limit: Number(limit),
      page: Number(page),
      total_page: Math.ceil(result.total / Number(limit))
    }
  })

}