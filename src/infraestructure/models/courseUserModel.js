import Sequelize from 'sequelize';
import Course from './courseModel.js';
import User from './userModel.js';
import connection from '../config/db.js';

const CourseUser = connection.define('curso_usuario', {
  idcurso_usuario: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idcurso: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'idcurso'
    }
  },
  idusuario: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'idusuario'
    }
  }
}, {
  tableName: 'curso_usuario',
});

CourseUser.belongsTo(Course, { foreignKey: 'idcurso', targetKey: 'idcurso' });
CourseUser.belongsTo(User, { foreignKey: 'idusuario', targetKey: 'idusuario' });

Course.belongsToMany(User, { through: CourseUser, foreignKey: 'idcurso' });
User.belongsToMany(Course, { through: CourseUser, foreignKey: 'idusuario' });

export default CourseUser;
