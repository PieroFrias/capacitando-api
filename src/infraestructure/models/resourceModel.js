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
  },
  url: {
    type: Sequelize.STRING(200),
    allowNull: false,
  },
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
