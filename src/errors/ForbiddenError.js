class ForbiddenError extends Error {
  constructor (message) {
    super();
    this.message = message;
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
