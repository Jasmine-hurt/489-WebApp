// const { sequelize } = require('../db');
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Deck extends Model {}

  Deck.init(
    {
      deckID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Deck'
    }
  );

  return Deck;
  //module.exports = Deck;
}