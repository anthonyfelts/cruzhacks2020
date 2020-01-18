const axios = require("axios");
const $ = require("cheerio");

const instance = axios.create({
  baseURL: "https://nutrition.sa.ucsc.edu/shortmenu.aspx",
  timeout: 1000,
  headers: {
    'Cookie' : 'WebInaCartLocation=; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=',
  }
});

const getMenu = (dh, meal) => {
  const diningHallNums = {
    "nineTen" : "40",
    "cowell"  : "05",
    "crown"   : "20",
    "rc"      : "30",
    "porter"  : "25"
  };

  const paramData = {
    locationNum: diningHallNums[dh],
    naFlag: 1
  };

  const url = "?" + Object.keys(paramData).map((k,_) => encodeURIComponent(k) + "=" + encodeURIComponent(paramData[k])).join("&");

  let data = {
    "Breakfast": [],
    "Lunch": [],
    "Dinner": [],
    "Late Night": []
  };

  return fetchData(url).then($ => {
    $("body > table > tbody > tr > td > table").map((_, item) => {
      const meal = $(item).find(".shortmenumeals").text();
      if(meal != "") {
        $(item).find(".shortmenurecipes > span").each((_, item) => data[meal].push(item.children[0].data.trim()));
    }});
    return data;
  });
};

const fetchData = async (siteUrl) => {
    const result = await instance.get(siteUrl);
    return $.load(result.data);
};


getMenu("nineTen", "").then(console.log);
