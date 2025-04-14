// const { sequelize } = require('../db');
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class StudyGuide extends Model {}

  StudyGuide.init(
    {
      guideID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'StudyGuide'
    }
  );
  
  return StudyGuide;
  //module.exports = StudyGuide;
}