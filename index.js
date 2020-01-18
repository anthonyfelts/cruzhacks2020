const siteUrl = "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=Colleges+Nine+%26+Ten+Dining+Hall&naFlag=1";
const axios = require("axios");

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};
