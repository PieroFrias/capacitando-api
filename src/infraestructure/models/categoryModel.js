import Sequelize from "sequelize";
import connection from "../config/db.js";

const Category = connection.define('categoria', {
  idcategoria: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoria: {
    type: Sequelize.STRING(200),
    allowNull: false,
    unique: true
  },
  estado: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 1
  }
}, {
  tableName: 'categoria',
});

import('./courseModel.js').then((Course) => {
  Category.hasMany(Course.default, { foreignKey: 'idcategoria' });
});

export default Category;
