import Sequelize from 'sequelize';
import Content from './contentModel.js';
import connection from '../config/db.js';

const Resource = connection.define('recurso', {
  idrecurso: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: true,
  },
  /*tipo_recurso: {
    type: Sequelize.STRING(45),
    allowNull: true,
  },*/
  url: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },
  /*archivo: {
    type: Sequelize.STRING(200),
    allowNull: true,
  },*/
  idcontenido: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references:{
      model: Content,
      key: 'idcontenido'
    }
  },
  estado: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1  
  },
}, {
  tableName: 'recurso',
});

Resource.belongsTo(Content, { foreignKey: 'idcontenido', targetKey: 'idcontenido' });

export default Resource;
