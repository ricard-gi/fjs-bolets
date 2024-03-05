// Define the sequelize setup
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize('bolets', 'root', 'admin', {
  //host: 'localhost',
  host: '192.168.5.248', //localhost

  dialect: 'mysql' // or any other dialect
});


// Define the Issue model
const Bolet = sequelize.define('bolet', {
  nom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: true
  },
  tipus: {
    type: Sequelize.ENUM('Comestible', 'No comestible', 'Perillós'),
    allowNull: false
  },
  foto: {
    type: Sequelize.STRING,
    allowNull: true
  },
});

// Define the Tag model
const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  }
});

// Define the User model
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Hook to hash the password before saving a new user
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});




Bolet.belongsToMany(Tag, { through: 'bolet_tag' }); // Many-to-many relationship between Bolet and Tag
Tag.belongsToMany(Bolet, { through: 'bolet_tag' }); // Many-to-many relationship between Tag and Bolet

User.hasMany(Bolet); // One user can have multiple bolets
Bolet.belongsTo(User); // A bolet belongs to one user


// Sync models with the database
/*
sequelize.sync({ force: true }) // This will drop the tables if they already exist
  .then(() => {
    console.log('Database & tables created!');
  });
*/

// Export models
module.exports = {
  Bolet,
  Tag,
  User
};
