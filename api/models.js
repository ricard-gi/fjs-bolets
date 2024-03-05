// Es defineix la configuració de sequelize
const Sequelize = require('sequelize'); // Importa la llibreria Sequelize

const bcrypt = require('bcrypt'); // Importa la llibreria bcrypt per a encriptar contrasenyes

const sequelize = new Sequelize('bolets', 'root', 'admin', {
  //host: 'localhost',
  host: '192.168.5.248', //IP de la base de dades
  dialect: 'mysql' // connectem a mysql
});


// Es defineix el model de Bolet
const Bolet = sequelize.define('bolet', {
  nom: {
    type: Sequelize.STRING,
    allowNull: false // No es permet valor nul per al nom
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: true // Es permet valor nul per a la descripció
  },
  tipus: {
    type: Sequelize.ENUM('Comestible', 'No comestible', 'Perillós'), // Només es permeten aquests valors
    allowNull: false // No es permet valor nul per al tipus
  },
  foto: {
    type: Sequelize.STRING,
    allowNull: true // Es permet valor nul per a la foto
  },
});

// Es defineix el model de Tag
const Tag = sequelize.define('tag', {
  name: {
    type: Sequelize.STRING,
    unique: true, // El nom del tag ha de ser únic
    allowNull: false // No es permet valor nul per al nom
  }
});

// Es defineix el model d'usuari
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false // No es permet valor nul per al nom
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false, // No es permet valor nul per a l'email
    unique: true // L'email ha de ser únic
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false // No es permet valor nul per a la contrasenya
  }
});


// hook per encriptar la contrasenya abans de desar un nou usuari
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10); // Encripta la contrasenya amb bcrypt
  user.password = hashedPassword;
});


// Establint relacions entre models

Bolet.belongsToMany(Tag, { through: 'bolet_tag' }); // Relació de molts a molts entre Bolet i Tag
Tag.belongsToMany(Bolet, { through: 'bolet_tag' }); // Relació de molts a molts entre Tag i Bolet

User.hasMany(Bolet); // Un usuari pot tenir molts bolets
Bolet.belongsTo(User); // Un bolet pertany a un únic usuari

// Exporta els models per a poder ser utilitzats en altres parts de l'aplicació
module.exports = {
  Bolet,
  Tag,
  User
};
