class InvalidDataError extends Error {
  constructor (message, details) {
    super(message || 'Não foi possível processar o formato dos dados');
    this.name = 'InvalidDataError';
    this.details = details;
  }
}

module.exports = InvalidDataError;
