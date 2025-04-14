var express = require('express');
var router = express.Router();
const { Deck, Flashcard } = require('../db');

router.get('/', (req, res) => {
  res.render('games');
});

router.get('/tapToReveal/play/:deckID', async (req, res) => {
  const userID = req.session.user?.id;
  const deckID = req.params.deckID;

  try {
    const deck = await Deck.findByPk(deckID, {
      include: [Flashcard]
    });

    if (!deck) {
      return res.status(404).send("Deck not found.");
    }

    if (deck.userID !== userID) {
      return res.status(403).send("Unauthorized to view this deck.");
    }

    res.render('tapToReveal', {
      flashcards: deck.Flashcards,
      deckID: deck.deckID
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading Tap to Reveal game.");
  }
});

router.get('/wordBank/play/:deckID', async (req, res) => {
  const userID = req.session.user?.id;
  const deckID = req.params.deckID;

  try {
    const deck = await Deck.findByPk(deckID, {
      include: [Flashcard]
    });

    if (!deck) return res.status(404).send("Deck not found.");
    if (deck.userID !== userID) return res.status(403).send("Unauthorized.");

    res.render('wordBank', {
      flashcards: deck.Flashcards,
      deckID: deck.deckID
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading Word Bank game.");
  }
});

router.get('/matching/play/:deckID', async (req, res) => {
  const userID = req.session.user?.id;
  const deckID = req.params.deckID;

  try {
    const deck = await Deck.findByPk(deckID, {
      include: [Flashcard]
    });

    if (!deck) return res.status(404).send("Deck not found.");
    if (deck.userID !== userID) return res.status(403).send("Unauthorized.");

    res.render('matching', {
      flashcards: deck.Flashcards,
      deckID: deck.deckID
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading Word Bank game.");
  }
});

router.get('/memoryPassage/play/:deckID', async (req, res) => {
  const userID = req.session.user?.id;
  const deckID = req.params.deckID;

  try {
    const deck = await Deck.findByPk(deckID, {
      include: [Flashcard]
    });

    if (!deck) return res.status(404).send("Deck not found.");
    if (deck.userID !== userID) return res.status(403).send("Unauthorized.");

    res.render('wordBank', {
      flashcards: deck.Flashcards,
      deckID: deck.deckID
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading Word Bank game.");
  }
});

module.exports = router;