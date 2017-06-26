const request = require('superagent');
const cheerio = require('cheerio');

const ALL_URL = 'http://www.digicamdb.com/cameras/canon/';

// loads HTML for given webpage
loadHTML = function(url) {
  return new Promise(
    function (resolve, reject) {
      request.get(url).end((err, response) => {
        const html = cheerio.load(response.text);
        resolve(html);
      });
    }
  )
}

// get array of camera names for each page
getCamNames = function(html) {
  let camNames = [];
  html(".newest_2 a").each(function(i, elem) {
    camNames[i] = elem.children[0].data.trim();
  });

  console.log(camNames);
  return Promise.resolve(camNames);
}

// gets the brand for a specific page
getBrand = function(html) {
  let brand = html("title").text().trim();
  brand = brand.replace(' Digital Cameras', '').toLowerCase();
  return generateBrandUrl(brand);
}

// appends the brand to the base url
generateBrandUrl = function(brand) {
  let brandUrl = (`http://www.digicamdb.com/cameras/${brand}`);
  return brandUrl;
}

// manages iteration through multiple pages
generatePageUrls = function(html){
  const brandUrl = getBrand(html);
  let pagination = [];
  html(".pagination_nr a").each(function(i, elem) {
    pagination[i] = brandUrl + '/' + elem.children[0].data;
  });
  return pagination;
}

// scrapes single page for camera names
scrapePage = function(urls){
  for(var i = 0; i < urls.length; i++){
    loadHTML(urls[i])
      .then(getCamNames)
      .catch(error => console.log(error.message));
  }
}

// scrapes all pages of site given the base brand url
exports.scrapeAllPages = function(url) {
  loadHTML(url)
    .then(generatePageUrls)
    .then(scrapePage)
}
