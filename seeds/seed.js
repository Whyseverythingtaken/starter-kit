const sequelize = require('../config/connection');

const Property = require('../models/Property');
const User = require('../models/User');
const Booking = require('../models/Booking');

const propertySeedData = require('./propertySeedData.json');
const userSeedData = require('./userSeedData.json');
const bookingSeedData = require('./bookingSeedData.json');

// TODO Use async / await to Refactor the seedDatabase function below
const seedDatabase = () => {
  return sequelize.sync({ force: true }).then(() => {
    Property.bulkCreate(propertySeedData).then(() => {
      User.bulkCreate(userSeedData).then(() => {
        Booking.bulkCreate(bookingSeedData).then(() => {
          console.log('All Seeds Planted');
          process.exit(0);
        });
      });
    });
  });
};

seedDatabase();
