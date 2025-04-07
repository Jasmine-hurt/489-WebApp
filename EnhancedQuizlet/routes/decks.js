var express = require('express');
var router = express.Router();
const { Deck } = require('../db');

router.get('/', async (req, res) => {
    const userID = req.session.user?.id;

    // user tries to view deck but is not logged in
    if (!userID) {
        req.flash('error', 'Please log in to view your decks.');
        return res.redirect('/auth/login');
    }

    try {
        // Gets all decks that the current user is the owner of.
        const decks = await Deck.findAll({
            where: { userID }
        });
        res.render('allDecksView', { decks });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load decks.");
    }
});

module.exports = router;