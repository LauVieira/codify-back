/* global jest, describe, it, expect  */
const UsersController = require('../../src/controllers/UsersController');
const User = require('../../src/models/User');

jest.mock('bcrypt', () => ({
  hashSync: (password) => password,
}));
jest.mock('../../src/models/User');
jest.mock('sequelize');

describe('saveUser', () => {
  it('should return a user with id', async () => {
    const body = {
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    };
    const expectedObject = {
      id: 1,
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    };
    User.create.mockResolvedValueOnce(expectedObject);
    const user = await UsersController.saveUser(body.name, body.email, body.password);
    expect(user).toEqual(expectedObject);
  });
});

describe('findUserByEmail', () => {
  it('should return the same object', async () => {
    const email = 'test@test.com';
    const expectedObject = {
      id: 1, email, name: 'test', password: '123456',
    };
    User.findOne.mockResolvedValueOnce(expectedObject);
    const user = await UsersController.findUserByEmail(email);
    expect(user).toEqual(expectedObject);
  });
});
