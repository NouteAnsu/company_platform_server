'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UseDayoff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.UseDayoff.belongsTo(models.User, { foreignKey: { name: 'user_id', allowNull: false }, sourceKey: 'id', onDelete: 'CASCADE' })
    }
  };
  UseDayoff.init({
    user_id: DataTypes.INTEGER,
    off_type: DataTypes.STRING,
    off_start: DataTypes.DATE,
    off_end: DataTypes.DATE,
    off_cnt: DataTypes.FLOAT,
    off_comment: DataTypes.STRING,
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UseDayoff',
  });
  return UseDayoff;
};