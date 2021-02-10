class NotFoundError extends Error {
  constructor (details) {
    super();
    this.details = details;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
