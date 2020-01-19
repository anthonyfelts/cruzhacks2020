const { dininghall } = require("../src/constants");
const { scrapeMenu } = require("../src/scrape");

const scrapeHook = async (context, timer) => {
  Object.values(dininghall).forEach(async x => { await scrapeMenu(x) });
  context.done();
};

scrapeHook();

module.exports = scrapeHook;
