require('dotenv').config();
const {drizzle} = require("drizzle-orm/mysql2");

const db = drizzle("mysql://root:Test_12345678@localhost:3306/AUTHE");

module.exports = db;