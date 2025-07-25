class ApiError extends Error{
    constructor(statusCode , message = "Something went wrong", errors=[] ){
       super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
    }
}
export default ApiError