export class HttpResponseError extends Error {
    constructor(message, statusCode) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.name = this.constructor.name;
      }
}

export class UserSignInError extends Error {
    constructor(message) {
        super();
        this.message = message; 
        this.name = this.constructor.name;
      }
}