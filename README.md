# CruzHacks2020 - UCSC Dining Hall Google/Alexa Skill
### Team: Anna Elise Wong, Talya Israel, Aram Chemishkian, Cole Scott, Anthony Felts

#### Inspiration
Most students at UCSC have at some point been frustrated with the terrible food menu website that the dining hall releases, and the challenge to pull it up on a mobile device. You finally open the website and are bombarded with the many unessential items that are standard. (ie. Cheese Pizza, Rice). Then when a generous student finally seems to have the solution (i.e. by sending out a text message to ‘subscribers’ of the dining hall options for the day), it proves to be unsustainable in some way (effort needed, financially, etc.) and is shut down after being implemented for under a year. That’s where our app comes in. It provides light and reliable voice access to the UCSC dining hall menus that can be deployed entirely in the free tier of the services it uses.

#### What it does
Our project is a google assistant and alexa skill which supports voice queries about dining hall food menus. It supports queries about current time dining hall offerings as well meal based queries.

#### Design Desisions
We choose to use DialogFlow for the main intent processing and a NodeJS webhook backend. The DialogFlow interface was used to train for intents and connect to the webhook backend. The backend has two main functions: It must scrape the UCSC dining hall website for menus and also serve those menus to the assistant webhook. We decided to use Azure Function Apps for the assistant webhooks because we were looking for more experience with Azure and it provides essentially the same functionality as AWS Lambdas. The scraper is implemented using Cheerio, a jQuery-like library for node. From this we were able to pull out specific menu items from each meal and query the dietary restrictions. We then are able to remove blacklisted items such as “Condiments” and “Cereal” which do not add anything useful to the menu and just make the readback longer.

#### Blockers
 * We ran into some challenges almost immediately with scraping the UCSC dining hall menu website. The site uses server-side rendering so there is no easy api endpoints we can just hit. The html that the site returns is also very messy and hard to do scraping on, leading to a bit of less than pretty code for parsing the output.
 * We also ran into issues with the Azure Function Apps not having amazing documentation. Many of the docs are out of date or list options that do not exist. This lead to a few hours of fighting with the azure cli to get manual deployment to the function apps working.

#### Accomplishments that we are proud of
The accomplishments that we are proud of is the project as a whole. Because this project was such a foreign concept to most of the group (down to the programming language that we used), it was a challenge to even write the basic for the project at first. To have a whole, working project at the end of this ~24 hours, and to have learned so much about javascript, MongoDB, DialogFlow, and how all the components work together is a huge accomplishment in itself and something that we are very proud of.

Most of our group was unfamiliar with programming in javascript (the language we used to write our program) and/or had never written an API for a Google Assistant/Alexa before this project, so this project as a whole was a huge learning experience. Our group show/what javascript is used for, and how to use MongoDB and DialogFlow to design this project from start to finish. One of the hardest parts by far for the beginners of the group was grasping the functionality of javascript and its syntax.

#### Feature List
We are hoping to add more user-specific intents to the integration including support for filtering by dietary restrictions and to allow users to select a preferred dining hall to use by default. We would also like to shift away from MongoDB as the main cache/storage and use a more robust and proven database such as Redis or Postgres.
##### Tier 1
  * Fuzzy queries using fuzzyset for specific items
  * streamline architecture and datapath
##### Tier 2
  * Transition to Postgres
  * Continuely improve fuzzy queries and resolve any issues that come up
##### Tier 3
  * Local device based favorites
  * Allergy/Preference customizations

