const kijiji = require('kijiji-scraper');
const mail = require('../handlers/mail');
const Watch = require('../models/Watch');

module.exports.searchPage = (req, res) => {
  res.render('search', { title: 'Search' });
};

module.exports.watchPage = (req, res) => {
  res.render('watch', {title: 'Create Kijiji Watch'});
};

module.exports.createWatch = (req, res) => {

  const watch = new Watch({
    keywords: req.body.keywords,
    email: req.body.email
  });
  watch.save(function (err, success) {
    if (err) return console.error(err);
    res.send('added item to DB');
  });
};

module.exports.getWatches = (req, res) => {
  Watch.find(function (err, watches) {
    if (err) res.send(err);
    res.json(watches);
  });
};

module.exports.search = (req, res, next) => {
  const prefs = {
    locationId: 1700192,
    categoryId: 10
  };
  const params = {
    keywords: req.body.keywords,
    adType: 'OFFER'
  };
  kijiji.query(prefs, params, function (err, ads) {
    if (err) return;

    if (req.body.new) {
      const newAds = ads.filter(ad => {
        return Date.parse(ad.pubDate) > (Date.now() - 1000 * 60 * 60 * 24 * 5);
      });
      res.json(newAds);
    } else {
      res.json(ads);
    }
  });
};

module.exports.testMail = (req, res) => {
  mail.send();
  res.send('it works?');
};
