'use strict'

require('dotenv').config({ path: __dirname + '/.env' })
module.exports = {
    Mongo_Url: process.env.Mongo_Url,
    SECRET_KEY_USER: process.env.SECRET_KEY_USER,
    PORT: process.env.PORT
}