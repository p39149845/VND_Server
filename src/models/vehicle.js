import mongoose from "mongoose"

const VehicleSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true
  },
  imageUrl: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  description: {
    type: String,
    required: true,
    trim: true
  },
  additional: [{
    type: String,
    trim: true
  }],
  country: {
    type: String,
    required: true,
    trim: true
  },
  regBook: {
    type: String,
    required: true,
    trim: true
  },
  regBookIm: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    }
  ],
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  numberPeople: {
    type: String,
    required: true,
    trim: true
  },
  foodDrink: {
    type: Boolean,
    default: false
  },
  karaoke: {
    type: Boolean,
    default: false
  },
  tv: {
    type: Boolean,
    default: false
  },
  gps: {
    type: Boolean,
    default: false
  },
  vehicleCreatedAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  }
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema)

export default Vehicle