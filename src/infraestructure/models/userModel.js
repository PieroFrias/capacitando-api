import Sequelize from 'sequelize';
import bcrypt from 'bcrypt';
import connection from '../config/db.js';

const User = connection.define('users', {
  idusuario: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: Sequelize.STRING(80),
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(300),
    allowNull: false,
  },
  nombre: {
    type: Sequelize.STRING(250),
    allowNull: false,
  },
  apellido: {
    type: Sequelize.STRING(250),
    allowNull: false,
  },
  telefono: {
    type: Sequelize.STRING(9),
    allowNull: true,
  },
  dni: {
    type: Sequelize.STRING(8),
    allowNull: true,
    unique: true,
  },
  correo: {
    type: Sequelize.STRING(250),
    allowNull: false,
    unique: true,
  },
  direccion: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  foto: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  carrera: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  perfil: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  rol: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  estado: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1
  },

}, {
  tableName: 'users',
});

// Método para comprobar la contraseña
User.prototype.comprobarPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Método para hashear la contraseña
User.addHook('beforeSave', async (user) => {
  if (user.changed('password') || user.isNewRecord) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  return Promise.resolve();
});

import('./courseUserModel.js').then((CourseUser) => {
  User.hasMany(CourseUser.default, { foreignKey: 'idusuario' });
});

import('./contentViewModel.js').then((ContentView) => {
  User.hasMany(ContentView.default, { foreignKey: 'idusuario' });
});

export default User;
