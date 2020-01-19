const { dininghall, meal } = require("./constants");
const { Menu, withDatabase } = require("./db");
const { scrapeMenu } = require("./scrape");
const { DateTime } = require("luxon");

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
  let prettyListString = prettyList(arrayMenu);

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

const getMenu = dh => {
  return new Promise((resolve, reject) => {
    withDatabase(client => {
      resolve(Menu.findOne({dininghall: dh}).exec());
    });
  });
};

// Intent handlers
const menuCurrent = dh => {
  let time = DateTime.local().setZone('America/Los_Angeles').toLocal().hour;

  if (time < 12) return menuMeal(dh, "Breakfast");
  else if (time >= 12 && time < 5) return menuMeal(dh, "Lunch");
  else if (time >= 5 && time < 9) return menuMeal(dh, "Dinner");
  else return menuMeal(dh, "Late Night");
};

const menuMeal = async (dh, meal) => {
  await scrapeMenu(dh);
  const menu = await getMenu(dh);
  return makeResponse(dh, meal, menu.data.find(x => x.meal == meal).menu);
};

const menuItem = item => {

};

menuMeal(dininghall.COWELL_STEVENSON, "Breakfast").then(console.log);

module.exports = { menuCurrent, menuMeal, menuItem };
