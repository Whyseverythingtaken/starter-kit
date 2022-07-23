// import models
const Booking = require('./Booking');
const Property = require('./Property');
const User = require('./User');
const Bookmark = require('./Bookmark');

// One User can have many properties
User.hasMany(Property, {
  onDelete: 'CASCADE',
});

// One property belongs to one user only.
Property.belongsTo(User);

// One User can have many bookmarks
User.hasMany(Bookmark, {
  onDelete: 'CASCADE',
});
// One bookmark belongs to one user only.
Bookmark.belongsTo(User);

// Products belongToMany Tags (through ProductTag)
Property.belongsToMany(User, { through: Booking, unique: false });
// Tags belongToMany Products (through ProductTag)
User.belongsToMany(Property, { through: Booking, unique: false });

module.exports = {
  Booking,
  Property,
  User,
  Bookmark,
};
