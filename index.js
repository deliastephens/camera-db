const getCameraByBrand = require('./getCameraByBrand.js')

const ALL_URL = 'http://www.digicamdb.com/cameras/canon/';

getCameraByBrand.scrapeAllPages(ALL_URL);
