// import models
const Booking = require('./Booking');
const Property = require('./Property');
const User = require('./User');

// Categories have many Products
User.hasMany(Property, {
  onDelete: 'CASCADE',
});

// Products belongsTo Category
Property.belongsTo(User);

// Products belongToMany Tags (through ProductTag)
Property.belongsToMany(Users, { through: Booking, unique: false });
// Tags belongToMany Products (through ProductTag)
User.belongsToMany(Property, { through: Booking, unique: false });

module.exports = {
  Booking,
  Property,
  User,
};
