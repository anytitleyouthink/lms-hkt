import { userMessages } from "~/constants/messages";
type ErrorItem = Record<string, 
 {
   msg:string
  [key: string]: any
 }
>;


export class ErrorResponse  {
  message: string;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
export class EntityError extends ErrorResponse {
  errors: ErrorItem;
  constructor({ message = userMessages.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorItem }) {
    super(message, 422);
    this.errors = errors;
  }
}

