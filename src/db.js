const mongoose = require("mongoose");
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost/test";
mongoose.connect(mongodbUri, {useNewUrlParser: true, useUnifiedTopology: true});
