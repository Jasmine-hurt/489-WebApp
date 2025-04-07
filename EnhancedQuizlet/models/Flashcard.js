// const { sequelize } = require('../db');
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Flashcard extends Model {}

  Flashcard.init(
    {
      flashcardID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      term: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deckID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Flashcard'
    }
  );
  
  return Flashcard;
  //module.exports = Flashcard;
}