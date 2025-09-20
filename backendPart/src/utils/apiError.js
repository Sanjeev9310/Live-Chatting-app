// class ApiError extends Error{
//       constructor(statusCode,message="something went wrong",errors=[],stack=""){
//         super(message)
//         this.statusCode=statusCode;
//         this.data=null;
//         this.message=message;
//         this.success=false;
//         this.errors=errors;
//         if(stack){
//             this.stack=stack;
//         }
//         else{
//             Error.captureStackTrace(this,this.constructor)
//         }
//     }
class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "", data = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = false;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } 
    else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(){
    return {
      statusCode: this.statusCode,
      message: this.message,
      success: this.success,
      errors: this.errors,
      data: this.data,
    }
  }
};

export {ApiError}














//  send(res) {
//     return res.status(this.statusCode).json({
//       success: false,
//       statusCode: this.statusCode,
//       message: this.message,
//       errors: this.errors
//     });
//   }






