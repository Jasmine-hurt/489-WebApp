var express = require('express');
var router = express.Router();
const { Flashcard, Deck } = require('../db');

router.get('/', async (req, res) => {
    try {
        const flashcard = await Flashcard.findAll();
        res.render('deckFlashcardsView', { flashcard });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load deck flashcards.");
    }
})

router.get('/:deckID/:flashcardIndex', async (req, res) =>{
    try {
        const userID = req.session.user?.id;
        const flashcardIndex = req.params.flashcardIndex;
        const deck = await Deck.findByPk(req.params.deckID, {
            include: [Flashcard]
        });

        if (!deck) {
            return res.status(404).send('Deck not found');
        }

        if (!deck.Flashcards[flashcardIndex]) {
            return res.status(404).send('Flashcard not in deck')
        }

        if (deck.userID == userID) {
            res.render('flashcardView', { deckID: deck.deckID , flashcards: deck.Flashcards, flashcardIndex })
        } else {
            return res.status(404).send('Not authorized to view these flashcards');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load flashcards.");
    }
});

router.post('/:deckID/:flashcardIndex/delete', async (req, res) => {
    try {
        const deck = await Deck.findByPk(req.params.deckID, {
            include: [Flashcard]
        });
        const { deckID, flashcardIndex } = req.params;
  
      // Get all flashcards for this deck, ordered by creation or ID
      const flashcards = await Flashcard.findAll({
        where: { deckID },
        order: [['flashcardID', 'ASC']]
      });

      const flashcard = flashcards[flashcardIndex];
  
      if (!flashcard) {
        return res.status(404).send('Flashcard not found.');
      }
  
      await flashcard.destroy();
      res.render('deckFlashcardsView', { deckID: deck.deckID, flashcards: deck.Flashcards });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving flashcard.");
    }
});
  

module.exports = router;