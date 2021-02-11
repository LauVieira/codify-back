class InvalidDataError extends Error {
  constructor (message, details) {
    super(message);
    this.name = 'InvalidDataError';
    this.details = details;
  }
}

module.exports = InvalidDataError;
