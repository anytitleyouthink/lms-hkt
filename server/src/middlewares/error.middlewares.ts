
import e, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import omit from 'lodash/omit';
import { ErrorResponse } from '~/models/Errors';

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof ErrorResponse)
  {
    return res.status(err.statusCode).json(omit(err, 'statusCode') || { message: err.message });
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true });
  });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message,error: omit(err, 'stack') });
};

export default defaultErrorHandler;