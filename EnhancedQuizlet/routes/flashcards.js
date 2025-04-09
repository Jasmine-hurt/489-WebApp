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

module.exports = router;