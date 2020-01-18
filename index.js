const siteUrl = "https://nutrition.sa.ucsc.edu/";
const axios = require("axios");
const cheerio = require("cheerio");

const fetchData = async () => {
    const result = await axios.get(siteUrl);
    return cheerio.load(result.data);
};

fetchData().then(data => console.log(data.html()));
