import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
    username: {type: String, required: true},
    city: {type: String, required: true},
    temperature: {type: Number, required: true},
    humidity: {type: Number, required: true},
    description: {type: String, required: true},
},{id: true, timestamps: true})

export const City = mongoose.model('City', citySchema)

