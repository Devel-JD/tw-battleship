import mongoose, { Schema } from 'mongoose'

const Coordinates = new Schema({
    x: Number, y: Number
}, { _id: false });

const History = new Schema({
    board_id: mongoose.Types.ObjectId,
    createdDate: { type: Date, default: Date.now },
    coordinates: [Coordinates],
    message: String
});

export default mongoose.model('History', History);