import { Router } from 'express'
import { accessTokenValidationMiddleware, verifiedUserValidator } from '~/middlewares/users.middleware'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'

import { wrapAsync } from '~/utils/handlers'
import { postIdValidator } from '~/middlewares/posts.middleware'
const likeroutes = Router()
/**
 * Path: /
 * Method: post
 * Header: { Authorization: Bearer <access_token> }
 * body: { post_id }
 */
likeroutes.post('/',
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  postIdValidator,
  wrapAsync(likeTweetController)
)
/**
 * Path: /:post_id
 * Method: delete
 * Header: { Authorization: Bearer <access_token> }
 * param: { post_id }
 */
likeroutes.delete('/:post_id',
  accessTokenValidationMiddleware,
  postIdValidator,
  verifiedUserValidator,
  wrapAsync(unlikeTweetController)
)
export default likeroutes