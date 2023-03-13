const sequelize = require('../config/connection');

const Property = require('../models/Property');
const User = require('../models/User');
const Booking = require('../models/Booking');

const propertySeedData = require('./propertySeedData.json');
const userSeedData = require('./userSeedData.json');
const bookingSeedData = require('./bookingSeedData.json');

// TODO Use async / await to Refactor the seedDatabase function below

const seedDatabase = async () => {
  await sequelize.sync({ force: false });
  await User.bulkCreate(userSeedData, { individualHooks: true });
  await Property.bulkCreate(propertySeedData);
  await Booking.bulkCreate(bookingSeedData);
  console.log('All Seeds Planted');
  process.exit(0);
};

seedDatabase();
