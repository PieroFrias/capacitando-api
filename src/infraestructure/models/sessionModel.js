import Sequelize from 'sequelize';
import Course from './courseModel.js';
import connection from '../config/db.js';

const Session = connection.define('sesion', {
  idsesion: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_sesion: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  idcurso: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
        model: Course,
        key: 'idcurso'
    }
  },
  estado: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1  
  },
}, {
  tableName: 'curso',
});

Session.belongsTo(Course, { foreignKey: 'idcurso', targetKey: 'idcurso' });

import('./contentModel.js').then((Content) => {
  Session.hasMany(Content.default, { foreignKey: 'idsesion' });
});

export default Session;
