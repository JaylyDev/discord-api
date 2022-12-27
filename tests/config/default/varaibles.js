// generates variables.json
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();

// This file is located in BDS
// All values must not leave blank
const variables = {
  "BOT_TOKEN": process.env.BOT_TOKEN,
  "TEST_GUILD": process.env.TEST_GUILD, // Jayly's Discord id
  "TEST_USER": process.env.TEST_USER, // Jayly id,
  "TEST_CHANNEL": process.env.TEST_CHANNEL // #general
};

fs.writeFileSync(path.resolve(__dirname, 'variables.json'), JSON.stringify(variables, null, 4));