'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('courses', [
      {
        title: 'JavaScript para Iniciantes',
        description: 'Aprenda JavaScript do zero hoje!',
        icon: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: 'https://image.freepik.com/fotos-gratis/antigas-cinzento-cimento-parede-fundos_34552-324.jpg',
      },
      {
        title: 'React para Iniciantes',
        description: 'Aprenda React do zero hoje!',
        icon: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: 'https://image.freepik.com/fotos-gratis/antigas-cinzento-cimento-parede-fundos_34552-324.jpg',
      },
      {
        title: 'NodeJs para Iniciantes',
        description: 'Aprenda NodeJs do zero hoje!',
        icon: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: 'https://image.freepik.com/fotos-gratis/antigas-cinzento-cimento-parede-fundos_34552-324.jpg',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('courses', [
      { title: 'JavaScript para Iniciantes' },
      { title: 'React para Iniciantes' },
      { title: 'NodeJs para Iniciantes' },
    ], {});
  },
};
