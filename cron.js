const Cronjob = require('cron').CronJob;
const Watch = require('./models/Watch');
const kijiji = require('kijiji-scraper');
const mail = require('./handlers/mail');
const util = require('util');

// promisify kijiji web scraper
const kijijiPromise = util.promisify(kijiji.query);

const job = new Cronjob('* * * * *', runJobs);

async function runJobs () {
  console.log('running jobs \n -----------------------');
  const watches = await Watch.find();
  console.log("watches:", watches);

  watches.forEach(async (watch) => {
    const prefs = {
      locationId: watch.locationId,
      categoryId: watch.categoryId
    };
    const params = {
      keywords: watch.keywords,
      adType: watch.adType
    };

    const ads = await kijijiPromise(prefs, params);

    console.log('ads: ', ads);

    const newAds = ads.filter((ad) => {
      const searchDate = watch.lastSearch || 0;
      return Date.parse(ad.pubDate) > searchDate;
    });

    console.log('new adds ------------------ \n' + newAds);

    newAds.forEach(async (ad) => {
      const options = {
        mailto: watch.email,
        subject: `New kijiji ad: ${ad.title}`,
        html: `<p>${ad.title}<p><a href="${ad.link}">${ad.link}</a>`
      };

      mail.send(options);

      const update = await Watch.findByIdAndUpdate(watch._id, {$set: { lastSearch: Date.now() }});
      console.log('last search date updated' + update);
    });
  });
};

runJobs();
job.start();

module.exports = job;
