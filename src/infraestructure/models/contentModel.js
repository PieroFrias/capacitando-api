import Sequelize from 'sequelize';
import Session from './sessionModel.js';
import connection from '../config/db.js';

const Content = connection.define('contenido', {
  idcontenido: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  idsesion: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
      model: Session,
      key: 'idsesion'
    }
  },
  url_video: {
    type: Sequelize.STRING(300),
    allowNull: false,
  },
  minutos_video: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  estado: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1  
  },
}, {
  tableName: 'contenido',
});

Content.belongsTo(Session, { foreignKey: 'idsesion', targetKey: 'idsesion' });

import('./resourceModel.js').then((Resource) => {
  Content.hasMany(Resource.default, { foreignKey: 'idcontenido' });
});

export default Content;
