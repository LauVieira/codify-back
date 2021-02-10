class UnauthorizedError extends Error {
  constructor (message) {
    super();
    this.message = message;
    this.name = 'UnauthorizedError';
  }
}

module.exports = UnauthorizedError;
