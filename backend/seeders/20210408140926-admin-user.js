'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id: 'cfeaec83-1e94-4921-9197-860ede05ac81',
      email: 'YWRtaW5AZ3JvdXBvbWFuaWEuY29t',
      username: 'Administrator',
      password: '$2b$10$.GU2sTadEOGVDyMwDnvayuBZW6tHtdQApSh.1HoZ1S1xd2cd2dWoy',
      isAdmin: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
