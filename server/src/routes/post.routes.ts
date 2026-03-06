import { Router } from "express";
import { 
  createPostController, 
  getPostChildrenController, 
  getPostController 
} from "~/controllers/posts.controllers";
import { 
  audienceValidator, 
  createPostsValidator, 
  getPostChildrenValidator, 
  paginationValidator, 
  postIdValidator 
} from "~/middlewares/posts.middleware";
import { 
  accessTokenValidationMiddleware, 
  verifiedUserValidator 
} from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/handlers";
import { isUserLoggedInValidator } from "~/middlewares/users.middleware";

const postsRoutes = Router();

/**
 * -------------------------------------------------------
 * 1. CREATE POST
 * Path: /
 * Method: POST
 * Yêu cầu: Bắt buộc đăng nhập + Đã verify + Body hợp lệ
 * -------------------------------------------------------
 */
postsRoutes.post('/',
  accessTokenValidationMiddleware,
  verifiedUserValidator,  
  createPostsValidator,            
  wrapAsync(createPostController)  
);

/**
 * -------------------------------------------------------
 * 2. GET POST DETAIL
 * Path: /:post_id
 * Method: GET
 * Yêu cầu: ID hợp lệ -> Lấy User (nếu có) -> Check quyền xem
 * -------------------------------------------------------
 */
postsRoutes.get('/:post_id',
  postIdValidator,               
  isUserLoggedInValidator(accessTokenValidationMiddleware), 
  // verifiedUserValidator,        
  audienceValidator,             
  wrapAsync(getPostController)
);

/**
 * -------------------------------------------------------
 * 3. GET POST CHILDREN (Comments, Quotes...)
 * Path: /:post_id/children
 * Method: GET
 * -------------------------------------------------------
 */
postsRoutes.get('/:post_id/children',
  postIdValidator,
  isUserLoggedInValidator(accessTokenValidationMiddleware),
  getPostChildrenValidator,
  paginationValidator,
  audienceValidator,
  wrapAsync(getPostChildrenController)
);

export default postsRoutes;