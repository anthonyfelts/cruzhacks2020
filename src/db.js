const mongoose = require("mongoose");
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost/test";

let client = null;

const withDatabase = f => {
  if(client) {
    f();
  } else {
    mongoose.connect(mongodbUri, {useNewUrlParser: true, useUnifiedTopology: true},
      (err, newClient) => {
        if(err) {
          throw err;
        }
        client = newClient;
        f();
      });
  }
};

const menuCacheSchema = new mongoose.Schema({
    diningHalls: [{dininghall: String, data: [{meal: String, menu: [String]}]}]
});
const MenuCache = mongoose.model('MenuCache', menuCacheSchema);

module.exports = { MenuCache, withDatabase };
