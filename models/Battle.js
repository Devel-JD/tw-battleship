import mongoose, { Schema } from 'mongoose'

const Coordinates = new Schema({
    x: Number, y: Number
}, { _id: false });

const Attacked = new Schema({
    x: Number, y: Number, hit: { type: Boolean, default: false }
}, { _id: false });

const EachShip = new Schema({
    shipType: String,
    coordinates: [Coordinates],
    length: Number
}, { _id: false });

const Battle = new Schema({
    createdDate: { type: Date, default: Date.now },
    ships: [EachShip],
    attacked: [Attacked]
});

export default mongoose.model('Battle', Battle);