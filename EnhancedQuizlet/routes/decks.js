var express = require('express');
var router = express.Router();
const { Deck } = require('../db');

router.get('/', async (req, res) => {
    try {
        const decks = await Deck.findAll();
        res.render('allDecksView', { decks });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load decks.");
    }
});

module.exports = router;