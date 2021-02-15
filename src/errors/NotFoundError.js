class NotFoundError extends Error {
  constructor (message) {
<<<<<<< HEAD
    super();
    this.details = details;
=======
    super(message);
>>>>>>> main
    this.name = 'NotFoundError';
    this.message = message;
  }
}

module.exports = NotFoundError;
