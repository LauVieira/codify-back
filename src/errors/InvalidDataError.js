class InvalidDataError extends Error {
  constructor (message) {
    super();
    this.message = message;
    this.name = 'InvalidDataError';
  }
}

module.exports = InvalidDataError;
