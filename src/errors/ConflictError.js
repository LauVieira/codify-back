class ConflictError extends Error {
  constructor (message) {
    super();
    this.message = message;
    this.name = 'ConflictError';
  }
}

module.exports = ConflictError;
