const express = require("express");
const router = express.Router();
const Activity = require("./models/activity");

router.get("/activity", async (req, res) => {
    try {
        const activities = await Activity.find({});
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activities", error });
    }
});

router.post("/activity", async (req, res) => {
    try {
        const { name, status, activityType, activityMessage, spotifySongName, spotifySongComposer, spotifyAlbumCoverURL, customStatus } = req.body;
        
        const newActivity = new Activity({
            name,
            status,
            activityType,
            activityMessage,
            spotifySongName,
            spotifySongComposer,
            spotifyAlbumCoverURL,
            customStatus
        });

        await newActivity.save();
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: "Error saving activity", error });
    }
});

module.exports = router;
