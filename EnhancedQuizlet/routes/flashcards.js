var express = require('express');
var router = express.Router();
const { Flashcard } = require('../db');

router.get('/', async (req, res) => {
    try {
        const flashcard = await Flashcard.findAll();
        res.render('deckFlashcardsView', { flashcard });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load deck flashcards.");
    }
})

module.exports = router;