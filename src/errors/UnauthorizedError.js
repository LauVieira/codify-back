class UnauthorizedError extends Error {
  constructor (details) {
    super();
    this.details = details;
  }
}

module.exports = UnauthorizedError;
