const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        selectJournal: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        selectTag: {
            type: String,
            required: true
        },
        emoji: {
            type: String,
            required: true
        },
        date: { type: Date, default: Date.now },
    },
    {
        collection:"JournalInfo",
    }

);

mongoose.model("JournalInfo",journalSchema);