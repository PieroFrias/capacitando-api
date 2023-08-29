import Sequelize from 'sequelize';
import Category from './categoryModel.js';
import connection from '../config/db.js';

const Course = connection.define('curso', {
  idcurso: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: Sequelize.STRING(250),
    allowNull: false,
    unique: true
  },
  url_portada: {
    type: Sequelize.STRING(250),
    allowNull: true,
  },
  url_video_intro: {
    type: Sequelize.STRING(250),
    allowNull: false,
  },
  hora_duracion: {
    type: Sequelize.DECIMAL,
    allowNull: true,
  },
  total_clases: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  idcategoria: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
        model: Category,
        key: 'idcategoria'
    }
  },
  estado: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1  
  },
}, {
  tableName: 'curso',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Course.belongsTo(Category, { foreignKey: 'idcategoria', targetKey: 'idcategoria' });

import('./sessionModel.js').then((Session) => {
  Course.hasMany(Session.default, { foreignKey: 'idcurso' });
});

import('./courseUserModel.js').then((CourseUser) => {
  Course.hasMany(CourseUser.default, { foreignKey: 'idcurso' });
});

export default Course;
