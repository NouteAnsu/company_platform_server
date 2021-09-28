'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Logs.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false }, sourceKey: 'id', onDelete: 'CASCADE' })
    }
  };
  Logs.init({
    user_id: DataTypes.INTEGER,
    login_date: DataTypes.DATE,
    login_result: DataTypes.INTEGER,
    ip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Logs',
  });
  return Logs;
};