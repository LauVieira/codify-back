class NotFoundError extends Error {
  constructor (message) {
    super(message);
    this.name = 'NotFoundError';
    this.message = message;
  }
}

module.exports = NotFoundError;
