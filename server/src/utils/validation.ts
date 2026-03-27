import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod'; // Import thêm ZodSchema hoặc ZodTypeAny
import { EntityError } from '~/models/Errors';

export const validate = <T extends ZodSchema>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, any> = {};
        
        error.issues.forEach((issue) => {
        
          const field = issue.path[1] || issue.path[0]; 
          
          errors[field.toString()] = {
            msg: issue.message,
           
          };
        });
        next(new EntityError({ errors }));
      } else {
        next(error);
      }
    }
  };
};