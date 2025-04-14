const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/EnhancedQuizletdb1.sqlite',
    logging: console.log
})

// import models
const defineUser = require('./models/User');
const defineDeck = require('./models/Deck');
const defineFlashcard = require('./models/Flashcard');

// initialize models
const User = defineUser(sequelize);
const Deck = defineDeck(sequelize);
const Flashcard = defineFlashcard(sequelize);

// relationships
User.hasMany(Deck, { foreignKey: 'userID', onDelete: 'CASCADE' });
Deck.belongsTo(User, { foreignKey: 'userID' });

Deck.hasMany(Flashcard, { foreignKey: 'deckID', onDelete: 'CASCADE' });
Flashcard.belongsTo(Deck, { foreignKey: 'deckID' });

module.exports = {
    sequelize,
    User,
    Deck,
    Flashcard
};