const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    timestamps: true,
    name: String,
    status: String,
    activityType: Number,
    activityMessage: String,
    spotifyMessage: String,
    customStatusMessage: String,
});

module.exports = mongoose.model("activity", ActivitySchema);