import Sequelize from 'sequelize';
import Content from './contentModel.js';
import User from './userModel.js';
import connection from '../config/db.js';

const ContentView = connection.define('contenido_vistas', {
  idcontenido_vistas: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idcontenido: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Content,
      key: 'idcontenido'
    }
  },
  idusuario: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'idusuario'
    }
  },
  min_video: {
    type: Sequelize.STRING(5),
    allowNull: true,
  }
}, {
  tableName: 'contenido_vistas',
});

ContentView.belongsTo(Content, { foreignKey: 'idcontenido', targetKey: 'idcontenido' });
ContentView.belongsTo(User, { foreignKey: 'idusuario', targetKey: 'idusuario' });

Content.belongsToMany(User, { through: ContentView, foreignKey: 'idcontenido' });
User.belongsToMany(Content, { through: ContentView, foreignKey: 'idusuario' });

export default ContentView;
