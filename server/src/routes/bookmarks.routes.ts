import { Router } from "express"
import { bookmarkPostController, unbookmarkPostController } from "~/controllers/bookmarks.controllers"
import { postIdValidator } from "~/middlewares/posts.middleware"
import { accessTokenValidationMiddleware, verifiedUserValidator } from "~/middlewares/users.middleware"
import { wrapAsync } from "~/utils/handlers"


const bookMarkRoutes = Router()
 /**
 * Path: /
 * Method: post
 * Header: { Authorization: Bearer <access_token> }
 * Body: { post_id }
 */
bookMarkRoutes.post('/',
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  postIdValidator,
  wrapAsync(bookmarkPostController)
)
 /**
 * Path: /:post_id
 * Method: delete
 * Header: { Authorization: Bearer <access_token> }
 * param: { post_id }
 */
bookMarkRoutes.delete('/:post_id',
  accessTokenValidationMiddleware,
  postIdValidator,
  verifiedUserValidator,
  wrapAsync(unbookmarkPostController)
)

export default bookMarkRoutes
