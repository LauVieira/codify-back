'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('courses', [
      {
        title: 'JavaScript do zero!',
        description: 'Aprenda JavaScript do zero ao avançado, com muita prática!',
        photo: 'https://cdn.icon-icons.com/icons2/2108/PNG/512/javascript_icon_130900.png',
        background: '#EFDA4F',
        alt: 'Foto logo do javascript'
      },
      {
        title: 'ReactJS do zero!',
        description: 'Aprenda ReactJS do zero ao avançado, com muita prática!',
        photo: 'https://miro.medium.com/max/3840/1*vHHBwcUFUaHWXntSnqKdCA.png',
        background: '#5ED3F3',
        alt: 'Foto logo do react'
      },
      {
        title: 'NodeJS do zero!',
        description: 'Aprenda NodeJS do zero ao avançado, com muita prática!',
        photo: 'https://adrianalonso.es/wp-content/uploads/2014/09/nodejs.png',
        background: '#8BBF3D',
        alt: 'Foto logo do node'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('courses', [
      { title: 'JavaScript para Iniciantes' },
      { title: 'React para Iniciantes' },
      { title: 'NodeJs para Iniciantes' }
    ]);
  },
};
