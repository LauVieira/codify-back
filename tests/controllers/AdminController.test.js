const AdminControllers = require('../../src/controllers/AdminController');
const Admin = require('../../src/models/Admin');
const Schemas = require('../../src/schemas');
const bcrypt = require('bcrypt');
const Err = require('../../src/errors');

jest.mock('sequelize');
jest.mock('../../src/models/Admin');
jest.mock('bcrypt');
jest.mock('../../src/schemas/adminSchemas');

describe('function validateEntriesData', () => {
    it('should throw a invalid data error', () => {
        const userData = {};
        Schemas.admin.login.validate.mockReturnValueOnce({ error: true });

        const error = () => AdminControllers.validateEntriesData(userData);

        expect(error).toThrow(Err.InvalidDataError);
    });

    it('should return undefined = all entries data is right', () => {
        const userData = {};
        Schemas.admin.login.validate.mockReturnValueOnce({ error: false });

        const result = AdminControllers.validateEntriesData(userData);

        expect(result).toBeUndefined();
    });
});

describe('function validateUserAndPassword', () => {
    it('should return the admin with id ', async () => {
        const userData = { username: 'teste', password: 'senha-teste' };
        const expected = { id: 1, username: 'teste' };

        Admin.findOne.mockResolvedValueOnce({ 
            ...expected,
            password: 'senha-teste',
            createdAt: '09/02/2021',
            updatedAt: '09/02/2021'
        });

        bcrypt.compareSync.mockImplementationOnce(() => true);

        const result = await AdminControllers.validateUserAndPassword(userData);

        expect(result).toMatchObject(expected);
    });

    it('should throw UnauthorizedError -> username is invalid', () => {
        const userData = { username: 'teste', password: 'senha-teste' };

        Admin.findOne.mockImplementationOnce(() => undefined);

        const error = () => AdminControllers.validateUserAndPassword(userData);

        expect(error).rejects.toThrow(Err.UnauthorizedError);
    });

    it('should throw UnauthorizedError -> password is invalid', () => {
        const userData = { username: 'teste', password: 'senha-teste' };

        Admin.findOne.mockImplementationOnce(() => {});

        bcrypt.compareSync.mockImplementationOnce(() => false);

        const error = () => AdminControllers.validateUserAndPassword(userData);

        expect(error).rejects.toThrow(Err.UnauthorizedError);
    });
});
