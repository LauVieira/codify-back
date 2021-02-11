class ForbiddenError extends Error {
  constructor (message) {
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
