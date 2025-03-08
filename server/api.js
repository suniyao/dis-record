const mongoose = require("mongoose");

const Activity = require("./models/activity");

router.get("/activity", (req, res) => {
    Activity.find({}).then((activities) => res.send(activities));
})

router.post("/activity", (req, res) => {
    const newActivity = new Activity ({

    });
    newActivity.save().then((activity) => res.send(activity));
})