import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
    trim: true
  },
  star: {
    type: Number,
    required: true,
    trim: true
  },
  reviewVehicle: {
    type: String,
    required: true,
    trim: true
  },
  starVehicle: {
    type: Number,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
})

const Review = mongoose.model("Review", ReviewSchema)

export default Review