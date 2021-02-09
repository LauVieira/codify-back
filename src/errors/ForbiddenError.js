class ForbiddenError extends Error {
  constructor (message) {
    super();
    this.message = message;
  }
}

module.exports = ForbiddenError;
