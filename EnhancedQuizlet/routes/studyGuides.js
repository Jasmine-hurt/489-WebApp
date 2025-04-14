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

// router.get('/create', (req, res) => {
// 	if (!req.session.user) return res.redirect('/auth/login');
// 	res.render('studyGuideCreation');
// });

// router.post('/create', async (req, res) => {
// 	const { title, content } = req.body;
// 	const userID = req.session.user?.id;

// 	try {
// 		await StudyGuide.create({ title, content, userID });
// 		req.flash('success', 'Study guide created!');
// 		res.redirect('/studyGuides');
// 	} catch (err) {
// 		console.error(err);
// 		req.flash('error', 'Failed to create study guide.');
// 		res.redirect('/studyGuides/create');
// 	}
// });

// router.get('/:guideID', async (req, res) => {
// 	const guide = await StudyGuide.findByPk(req.params.guideID);
// 	if (!guide) return res.status(404).send('Study guide not found');

// 	res.render('studyGuideView', { guide });
// });

module.exports = router;