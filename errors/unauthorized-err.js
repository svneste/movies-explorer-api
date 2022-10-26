class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 411;
  }
}

module.exports = Unauthorized;
