const { menuCurrent, menuMeal } = require("../src/intents");

const googleWebhookHandler = async (context, req) => {
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
      context.res = ok("I don't know how to help with that.");
      break;
    }
  }
};

module.exports = googleWebhookHandler;
