class ForbbidenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbbidenError';
  }
}

module.exports = ForbbidenError;
