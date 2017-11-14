const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', searchController.searchPage);
router.post('/search', searchController.search);

router.get('/watch', searchController.watchPage);
router.post('/watch', searchController.createWatch);

router.get('/watches', searchController.getWatches);

router.get('/mail', searchController.testMail);

module.exports = router;
