const axios = require("axios");
const $ = require("cheerio");
const { DateTime } = require("luxon");

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

const makeResponse = (dininghall, meal, arrayMenu) => {

  //CASE: Empty arrayMenu
  if (arrayMenu.length == 0){

    //Create an array with multiple variations of the same response
    let noMenuResponseArray = [
      `I'm sorry, but there is no menu available for ${meal} at ${dininghall} dining hall`,
      `Unfortunately, no menu is available for ${meal} at ${dininghall} dining hall`,
      `Sadly, ${dininghall} dininghall has no menu available for ${meal}.`
      ]

    //Return a random response from the array
    let randomInt = Math.floor(Math.random() * noMenuResponseArray.length);
    return noMenuResponseArray[randomInt];
  }

  //Pull cleaned array from prettyList
  let prettyListString = prettyList(arrayMenu); //is this correct way to use func?

  //CASE: menuMeal

  let menuMealResponseArray = [
      `Today for ${meal}, ${dininghall} dining hall is serving ${prettyListString}.`,
      `${dininghall} dining hall is serving ${prettyListString} for ${meal} today.` //if the prettyList is too long, this is not a good response
      ]

      let randomInt = Math.floor(Math.random() * menuMealResponseArray.length);
      return menuMealResponseArray[randomInt];

};

const prettyList = arrayMenu => {
  const commaMenu = arrayMenu.slice(0, -1);
  const andMenu = arrayMenu.slice(-1);
  return commaMenu.join(', ') + ", and " + andMenu;
};

// getMenu(dininghall.COWELL_STEVENSON, "").then(x => console.log(prettyList(x["Dinner"])));

module.exports = async (context, req) => {
  const ok = text => { return { status: 200, body: {fulfillmentText: text}}};

  const intent = req.body.queryResult.intent.name;
  switch(intent) {
    case "projects/dininghallagent-wxjsso/agent/intents/a7819adb-5c87-46ba-99c3-dde1fe271bca": {
      // DiningHallMenuCurrent
      const dh = req.body.queryResult.parameters.DiningHall;
      const menu = await menuCurrent(dh);

      context.res = ok(menu);
      break;
    }
    case "projects/dininghallagent-wxjsso/agent/intents/1352c30e-00cd-4f4d-8211-9dd186604455": {
      // DiningHallMenuMeal
      const dh = req.body.queryResult.parameters.DiningHall;
      const meal = req.body.queryResult.parameters.Meal;
      const menu = await menuMeal(dh, meal);

      context.res = ok(menu);

      break;
    }
    default: {
      console.error(`Unable to handle intent ${intent}`);
      context.res = {
        status: 400,
        body: { fulfillmentText: "Sorry, I don't know how to respond to that." }
      };
      break;
    }
  }
};

// MENU OPTIONS HERE

const menuCurrent = dh => {
  let time = DateTime.local().setZone('America/Los_Angeles').toLocal().hour;

  if (time < 12) return menuMeal(dh, "Breakfast");
  else if (time >= 12 && time < 5) return menuMeal(dh, "Lunch");
  else if (time >= 5 && time < 9) return menuMeal(dh, "Dinner");
  else return menuMeal(dh, "Late Night");
};

const menuMeal = async (dh, meal) => {
  const menu = await getMenu(dh);
  return makeResponse(dh, meal, menu[meal]);
};

const menuItem = item => {

};
