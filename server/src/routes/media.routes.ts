import { Router } from "express";
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from "~/controllers/medias.controllers";
import {
  accessTokenValidationMiddleware,
  verifiedUserValidator
} from "~/middlewares/users.middleware";
import { wrapAsync } from "~/utils/handlers";

const mediasRoutes = Router();

/**
 * Description: Upload image
 * Path: /upload_image
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
mediasRoutes.post(
  "/upload_image",
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  wrapAsync(uploadImageController)
);

/**
 * Description: Upload video
 * Path: /upload_video
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
mediasRoutes.post(
  "/upload_video",
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  wrapAsync(uploadVideoController)
);

/**
 * Description: Upload video HLS
 * Path: /upload_video_hls
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
mediasRoutes.post(
  "/upload_video_hls",
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  wrapAsync(uploadVideoHLSController)
);

/**
 * Description: Get video processing status
 * Path: /video_status/:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * 
 */
mediasRoutes.get(
  "/video_status/:id",
  accessTokenValidationMiddleware,
  verifiedUserValidator,
  wrapAsync(videoStatusController)
);

export default mediasRoutes;
