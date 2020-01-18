const siteUrl = "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=Colleges+Nine+%26+Ten+Dining+Hall&naFlag=1";
const axios = require("axios");
const $ = require("cheerio");

const instance = axios.create({
  timeout: 1000,
  headers: {
    'Cookie' : 'SavedAllergens=; SavedWebCodes=; WebInaCartLocation=40; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=',
  }
});

const fetchData = async () => {
    const result = await instance.get(siteUrl);
    return $.load(result.data);
};

let data = {
  "Breakfast": [],
  "Lunch": [],
  "Dinner": []
};

fetchData().then($ => {
  $("body > table > tbody > tr > td > table").map((_, item) => {
    const meal = $(item).find(".shortmenumeals").text();
    if(meal != "") {
      $(item).find(".shortmenurecipes > span").each((_, item) => data[meal].push(item.children[0].data.trim()));
  }});

  console.log(data);
});

