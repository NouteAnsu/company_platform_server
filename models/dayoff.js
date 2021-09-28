'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dayoff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Dayoff.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false }, sourceKey: 'id', onDelete: 'CASCADE' })
    }
  };
  Dayoff.init({
    user_id: DataTypes.INTEGER,
    total_cnt: DataTypes.FLOAT,
    rest_cnt: DataTypes.FLOAT,
    use_cnt: DataTypes.FLOAT,
    expire_day:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Dayoff',
  });
  return Dayoff;
};