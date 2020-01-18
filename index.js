const siteUrl = "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=Colleges+Nine+%26+Ten+Dining+Hall&naFlag=1";
const axios = require("axios");
const $ = require("cheerio");

const instance = axios.create({
  // baseURL: '',
  timeout: 1000,
  headers: {
    'Cookie' : 'SavedAllergens=; SavedWebCodes=; WebInaCartLocation=40; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=',
  }
});

const fetchData = async () => {
    const result = await instance.get(siteUrl);
    return $.load(result.data);
};



fetchData().then(data => {
  const meals = data(".shortmenumeals").map((_, item) => item.children[0].data).get();

  console.log(meals);

  data(".shortmenurecipes > span").map((_, item) => console.log(item.children[0].data));

});

