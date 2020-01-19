const mongoose = require("mongoose");
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost/test";

mongoose.set('useFindAndModify', false);
let client = null;

const withDatabase = f => {
  if(client) {
    f(client);
  } else {
    mongoose.connect(mongodbUri, {useNewUrlParser: true, useUnifiedTopology: true},
      (err, newClient) => {
        if(err) {
          console.error("Failed to connect to mongodb :)");
          throw err;
        }
        client = newClient;
        f(client);
      });
  }
};

// Schema for menu for a specific dining hall
const menuSchema = new mongoose.Schema({
    dininghall: String, data: [{meal: String, menu: [String]}]
});
const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu, withDatabase };
