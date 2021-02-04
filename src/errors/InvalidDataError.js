class InvalidDataError extends Error {
  constructor (details) {
    super();
    this.details = details;
  }
}

module.exports = InvalidDataError;
