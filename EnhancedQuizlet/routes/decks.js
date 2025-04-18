var express = require('express');
var router = express.Router();
const { Deck, Flashcard } = require('../db');

// view all decks
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

// show deck creation form
router.get('/create', async (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in to create a deck.');
        return res.redirect('/auth/login');
    }
    
    try {
        const flashcards = [];
        res.render('deckCreation', { flashcards: flashcards });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load deck creation page.");
    }
});

router.use(express.urlencoded({ extended: true }));

// handling deck creation
router.post('/create', async (req, res) => {
    const userID = req.session.user?.id;
    const { title, description, terms = [], descriptions = [] } = req.body;
  
    if (!userID) {
        req.flash('error', 'Please log in to create a deck.');
        return res.redirect('/auth/login');
    }

    try {
        const newDeck = await Deck.create({ title, description, userID });
  
        for (let i = 0; i < terms.length; i++) {
          if (terms[i] && descriptions[i]) {
            await Flashcard.create({
              term: terms[i],
              description: descriptions[i],
              deckID: newDeck.deckID
            });
          }
        }
  
      req.flash('success', 'Deck and flashcards created!');
      res.redirect('/decks');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Failed to create deck.');
      res.redirect('/decks/create');
    }
  });

// view a single deck with its flashcards
router.get('/:deckID', async (req, res) => {
    try {
        const userID = req.session.user?.id;
        const deck = await Deck.findByPk(req.params.deckID, {
            include: [Flashcard]
        });

        if (!deck) {
            return res.status(404).send('Deck not found');
        }

        if (deck.userID == userID) {
            res.render('deckFlashcardsView', { deck: deck, flashcards: deck.Flashcards });
        } else {
            return res.status(404).send('Not authorized to view this deck');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load deck.");
    }
});

router.post('/:deckID/delete', async (req, res) => {
    try {
        const deckID = req.params.deckID;
        deck = await Deck.findByPk(deckID);
        if (deck) {
            await deck.destroy();
            await Flashcard.destroy({ where: { deckID } });
        }
        
        res.redirect('/decks');
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed delete deck.");
    }
});

router.post('/:deckID/addCard', async (req, res) => {
    try {
        const deckID = req.params.deckID;
        const { term, definition } = req.body;
        deck = await Deck.findByPk(deckID);
        if (deck) {
            await Flashcard.create({
                term: term,
                description: definition,
                deckID: deckID
              });
        }
        console.log(term);
        console.log(definition);
        
        res.redirect(`/decks/${deckID}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed add flashcard.");
    }
});

router.post('/:deckID/edit', async (req, res) => {
    try {
        const deckID = req.params.deckID;
        const { title, description } = req.body;

        const deck = await Deck.findByPk(deckID);
        if (deck) {
            deck.title = title;
            deck.description = description;
            await deck.save();
        }

        res.redirect(`/decks/${deckID}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update deck.");
    }
});
  
module.exports = router;