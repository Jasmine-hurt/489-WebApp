const express = require('express');
const router = express.Router();
const { StudyGuide } = require('../db');

router.get('/', async (req, res) => {
	const userID = req.session.user?.id;
	
    // user tries to view study guide but is not logged in
    if (!userID) {
        req.flash('error', 'Please log in to view your study guides.');
         return res.redirect('/auth/login');
    }

    try {
        const guides = await StudyGuide.findAll({
             where: { userID } 
        });
        res.render('allGuidesView', { guides });
    } catch (err) {
        console.error(error);
        res.status(500).send("Failed to load study guides.");
    }
});

router.get('/create', (req, res) => {
	if (!req.session.user) {
        req.flash('error', 'Please log in to create a study guide.');
        return res.redirect('/auth/login');
    }
    
    try {
        res.render('studyGuideCreation');
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load study guide creation page.");
    }
});

router.use(express.urlencoded({ extended: true }));

router.post('/create', async (req, res) => {
    console.log("REQ BODY:", req.body);

	const { title, content } = req.body;
	const userID = req.session.user?.id;
  
    if (!userID) {
        req.flash('error', 'Please log in to create a study guide.');
        return res.redirect('/auth/login');
    }

	try {
		await StudyGuide.create({ title, content, userID });
		req.flash('success', 'Study guide created!');
		res.redirect('/studyGuides');
	} catch (err) {
		console.error(err);
		req.flash('error', 'Failed to create study guide.');
		res.redirect('/studyGuides/create');
	}
});

router.get('/:guideID', async (req, res) => {
    try {
        const guide = await StudyGuide.findByPk(req.params.guideID);
        
        if (!guide) {
            return res.status(404).send('Study guide not found');
        }
    
        if (guide.userID == userID) {
            res.render('studyGuideView', { guide });
        } else {
            return res.status(404).send('Not authorized to view this study guide');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to load study guide.");
    }
});

module.exports = router;