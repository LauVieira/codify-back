/* global jest, describe, it, expect  */
const UsersController = require('../../src/controllers/UsersController');
const User = require('../../src/models/User');
const Err = require('../../src/errors');

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

  it('should be called with the right parameters', () => {
    const name = 'name';
    const email = 'email@email.com';
    const password = '123456';

    const spy = jest.spyOn(User, 'create');
    UsersController.saveUser(name, email, password);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ name, email, password });
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

  it('should be called with the right parameters', () => {
    const email = 'email@email.com';

    const spy = jest.spyOn(User, 'findOne');
    UsersController.findUserByEmail(email);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({ where: { email } });
  });
});

describe('checkExistingUser', () => {
  it('should return undefined -> no exist user in DB', async () => {
    const email = 'email@email.com';
    const spy = jest.spyOn(UsersController, 'findUserByEmail');
    spy.mockImplementationOnce(() => false);

    const response = await UsersController.checkExistingUser(email);
    expect(response).toBeUndefined();
  });

  it('should throw an Error -> exist user in DB', () => {
    const email = 'email@email.com';
    const spy = jest.spyOn(UsersController, 'findUserByEmail');
    spy.mockImplementationOnce(() => true);

    const error = () => UsersController.checkExistingUser(email);
    expect(error).rejects.toThrow(Err.ConflictError);
  });
});

describe('getUser', () => {
  it('should return an user', async () => {
    const id = 1;
    const spy = jest.spyOn(User, 'findByPk');
    spy.mockImplementationOnce(() => ({ id }));

    const user = await UsersController.getUser(id);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(id);
    expect(user).toEqual(expect.objectContaining({ id }));
  });

  it('should throw an NotFoundError in user', () => {
    const id = 3;

    User.findByPk.mockImplementationOnce(() => null);

    const error = () => UsersController.getUser(id);

    expect(error).rejects.toThrow(Err.NotFoundError);
  });
});

describe('editUser', () => {
  it('should return the object updated for user', async () => {
    const save = jest.fn();
    const oldObject = { obj: 'objUser Old', save };
    const expectedObject = { obj: 'objUser New' };

    jest.spyOn(UsersController, 'getUser').mockResolvedValueOnce(oldObject);

    const request = await UsersController.editUser(2, expectedObject);
    
    expect(save).toHaveBeenCalled();
    expect(request).toEqual(
      expect.objectContaining(expectedObject)
    );
  });
});