const mongoose = require("mongoose");

const mongoConnectionURL = "mongodb+srv://stephyao:Ysn20070728@creepiscord.rc853.mongodb.net/?retryWrites=true&w=majority&appName=creepiscord";
const databaseName = "creepiscord";
const options = { useNewUrlParser: true, useUnifiedTopology: true, dbName: databaseName};

mongoose
    .connect(mongoConnectionURL, options)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));