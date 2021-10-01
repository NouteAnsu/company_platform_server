'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasOne(models.Dayoff, { foreignKey: { name: 'user_id', allowNull: false }, sourceKey: 'id', onDelete: 'CASCADE' });
      models.User.hasMany(models.UseDayoff, { foreignKey: { name: 'user_id', allowNull: false }, sourceKey: 'id', onDelete: 'CASCADE' });
      models.User.hasMany(models.Logs, { foreignKey: { name: 'user_id', allowNull: false }, sourceKey: 'id', onDelete: 'CASCADE' });
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    auth: DataTypes.INTEGER,
    dept: DataTypes.STRING,
    state: DataTypes.INTEGER,
    join_date: DataTypes.INTEGER,
    profile_img: DataTypes.STRING,
    resignation_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};