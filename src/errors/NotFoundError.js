class NotFoundError extends Error {
  constructor (message) {
    super();
    this.details = details;
    this.name = 'NotFoundError';
    this.message = message;
  }
}

module.exports = NotFoundError;
