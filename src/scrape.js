const { dininghall, meal } = require("./constants");
const { Menu, withDatabase } = require("./db");

const axios = require("axios");
const $ = require("cheerio");

const instance = axios.create({
  baseURL: "https://nutrition.sa.ucsc.edu/shortmenu.aspx",
  timeout: 1000,
  headers: {
    'Cookie': 'WebInaCartLocation=; WebInaCartDates=; WebInaCartMeals=; WebInaCartRecipes=; WebInaCartQtys=',
  }
});

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
  const wordsToDelete = ['condiments', 'black beans', "chef's special", 'bar indian', 'bar carribean', 'bar pasta', 'hawaiian bar', 'steamed rice', 'bar rice bowl', 'steamed basmati rice', 'steamed brown rice', 'thai green curry sauce', 'hard-boiled cage free eggs', 'cage-free scrambled eggs', 'cheese pizza', 'sticky rice', 'oven roasted allergen free chicken thigh'];

  var out = {};
  Object.keys(items).map(k => {
    out[k] = items[k].filter(item => !wordsToDelete.includes(item.toLowerCase()));
  });
  return out;
};

const scrapeMenu = dh => {
  getMenu(dh).then(menu => {
    withDatabase(client => {
      const menuCache = Menu.findOneAndUpdate({dininghall: dh}, 
        { $set: {
            dininghall: dh,
            data: menu
          }
        }, { upsert: true },
        (err, doc) => {
          if(err) {
            console.error("Error inserting dining hall menu: ", err);
          }
        });
    });
  });
};

const getMenu = (dh) => {
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
    return Object.entries(sanitizeMealItems(data)).map((k,i) => ({ meal: k[0], menu: k[1] }));
  });
};

module.exports = { scrapeMenu };
