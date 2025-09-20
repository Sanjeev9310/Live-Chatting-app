class ApiResponse{
    constructor(statusCode,data,message="success"){
        this.statusCode=statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode// status code length not should be more than 400
    }
//     send(res) {
//     return res.status(this.statusCode).json({
//       success: this.success,
//       statusCode: this.statusCode,
//       message: this.message,
//       data: this.data
//     });
//   }
}
export {ApiResponse}