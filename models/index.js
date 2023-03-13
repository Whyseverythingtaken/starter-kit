// import models
const Booking = require('./Booking');
const Property = require('./Property');
const User = require('./User');
const Bookmark = require('./Bookmark');

// One User can have many properties
User.hasMany(Property, {
  foreignKey: 'landlord_id',
  onDelete: 'CASCADE',
});

// One property belongs to one user only.
Property.belongsTo(User, { as: 'owner', foreignKey: 'landlord_id' });

// One User can have many bookmarks
User.hasMany(Bookmark, {
  onDelete: 'CASCADE',
});
// One bookmark belongs to one user only.
Bookmark.belongsTo(User);

// One user has many bookings
User.hasMany(Booking, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// One booking belongs to one user only.
Booking.belongsTo(User, { as: 'tenant', foreignKey: 'user_id' });

// Property has many bookings
Property.hasMany(Booking, {
  foreignKey: 'property_id',
  onDelete: 'CASCADE',
});

// One booking belongs to one property only.
Booking.belongsTo(Property, { as: 'rental', foreignKey: 'property_id' });

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
