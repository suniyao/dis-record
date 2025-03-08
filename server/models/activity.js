const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, required: true },
    activityType: { type: Number, required: false }, 
    activityMessage: { type: String, required: false },
    spotifySongName: { type: String, required: false },
    spotifySongComposer: { type: String, required: false },
    spotifyAlbumCoverURL: { type: String, required: false }, 
    // spotifyMessage: { type: String, required: false },
    customStatusMessage: { type: String, required: false },
}, { timestamps: true }); // Add timestamps correctly

module.exports = mongoose.model("Activity", ActivitySchema);
