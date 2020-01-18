const siteUrl = "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=Colleges+Nine+%26+Ten+Dining+Hall&naFlag=1";
const axios = require("axios");
const cheerio = require("cheerio");

const instance = axios.create({
  // baseURL: '',
  timeout: 1000,
  headers: {
    'Cookie' : 'SavedAllergens=; SavedWebCodes=; WebInaCartLocation=40; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=',
  }
});

const fetchData = async () => {
    const result = await instance.get(siteUrl);
    return cheerio.load(result.data);
};

// fetchData();
fetchData().then(data => console.log(data.html()));

// const $ = await fetchData();
// const postJobButton = $('.top > .action-post-job').text();
// console.log(postJobButton) // Logs 'Post a Job'
