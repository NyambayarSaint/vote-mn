const mongoose = require("mongoose");

const signer = new mongoose.Schema({ name: String, facebookID: String });

const Schema = mongoose.Schema(
    {
        name: String,
        team: String,
        img: String,
        votes: [signer]
    },
    { collection: "participants" }
);

const model = mongoose.model("participants", Schema);

module.exports = model;
