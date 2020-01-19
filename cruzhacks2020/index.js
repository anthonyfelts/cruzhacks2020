const axios = require("axios");
const $ = require("cheerio");

const instance = axios.create({
  baseURL: "https://nutrition.sa.ucsc.edu/shortmenu.aspx",
  timeout: 1000,
  headers: {
    'Cookie': 'WebInaCartLocation=; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=',
  }
});

const dininghall = {
  NINE_TEN: "9/10",
  COWELL_STEVENSON: "Cowell/Stevenson",
  CROWN_MERRILL: "Crown/Merrill",
  RCC_OAKES: "RCC/Oakes",
  PORTER_KRESGE: "Porter/Kresge"
};

const getMenu = (dh, meal) => {
  let data = {
    "Breakfast": [],
    "Lunch": [],
    "Dinner": [],
    "Late Night": []
  };

  return fetchData(buildURL(dh)).then($ => {
    $("body > table > tbody > tr > td > table").map((_, item) => {
      const meal = $(item).find(".shortmenumeals").text();
      if(meal != "") {
        $(item).find(".shortmenurecipes > span").each((_, item) => data[meal].push(item.children[0].data.trim()));
    }});
    return sanitizeMealItems(data);
  });
};

const buildURL = (dh) => {
  const diningHallNums = dh => {
    switch(dh) {
      case dininghall.NINE_TEN: return "40";
      case dininghall.COWELL_STEVENSON: return "05";
      case dininghall.CROWN_MERRILL: return "20";
      case dininghall.RCC_OAKES: return "30";
      case dininghall.PORTER_KRESGE: return "25";
    }};

  const paramData = {
    locationNum: diningHallNums(dh),
    naFlag: 1
  };

  return "?" + Object.keys(paramData).map((k,_) => encodeURIComponent(k) + "=" + encodeURIComponent(paramData[k])).join("&");
};

const fetchData = async (siteUrl) => {
    const result = await instance.get(siteUrl);
    return $.load(result.data);
};

const sanitizeMealItems = items => {
  const wordsToDelete = ['condiments', 'black beans', "chef's special", 'bar indian', 'bar carribean', 'bar pasta', 'hawaiian bar', 'steamed rice', 'bar rice bowl', 'steamed basmati rice', 'steamed brown rice', 'thai green curry sauce'];

  var out = {};
  Object.keys(items).map(k => {
    out[k] = items[k].filter(item => !wordsToDelete.includes(item.toLowerCase()));
  });
  return out;
};

// MAKE RESPONSE AND PRETTY LIST HERE

const makeResponse = arrayMenu => {

};

const prettyList = arrayMenu => {

};

// getMenu(dininghall.COWELL_STEVENSON, "").then(console.log);

module.exports = async (context, req) => {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.res = {
        status: 200,
        body: {fulfillmentText: "Hello, azure world"}
    };
};

// MENU OPTIONS HERE

const menuCurrent = dininghall => {

};

const menuMeal = (dininghall, time) => {

};

const menuItem = item => {

};
