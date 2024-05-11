// Filename: Model\book.js

import mongoose from "mongoose";

const NotifySchema = new mongoose.Schema({
    NotifyName: { type: String, required: true },
    description: { type: String, default: "" },
    NotifyStatus: { type: Number, default: 1 },
    NotifyType: { type: String, default: "" },
    transactions: [{ type: mongoose.Types.ObjectId, ref: "BookTransaction" }],
    books: [{ type: mongoose.Types.ObjectId, ref: "Book" }],
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    staff_creat: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        // required: true
    },
    staff_edit: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        // required: true
    },

}, {
    timestamps: true
});

const Notify = mongoose.model("Notify", NotifySchema);

export default Notify;

