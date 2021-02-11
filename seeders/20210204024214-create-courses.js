'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('courses', [
      {
        title: 'JavaScript para Iniciantes',
        description: 'Aprenda JavaScript do zero hoje!',
        photo: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: 'https://image.freepik.com/fotos-gratis/antigas-cinzento-cimento-parede-fundos_34552-324.jpg',
      },
      {
        title: 'React para Iniciantes',
        description: 'Aprenda React do zero hoje!',
        photo: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: 'https://image.freepik.com/fotos-gratis/antigas-cinzento-cimento-parede-fundos_34552-324.jpg',
      },
      {
        title: 'NodeJs para Iniciantes',
        description: 'Aprenda NodeJs do zero hoje!',
        photo: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: 'https://image.freepik.com/fotos-gratis/antigas-cinzento-cimento-parede-fundos_34552-324.jpg',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('courses', null, {});
  },
};
