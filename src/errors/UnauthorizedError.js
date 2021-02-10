class UnauthorizedError extends Error {
  constructor (message) {
    super();
    this.message = message;
  }
}

module.exports = UnauthorizedError;
