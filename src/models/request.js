import mongoose from "mongoose"

const RegSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true,
    trim: true
  },
  stopDate: {
    type: String,
    required: true,
    trim: true
  },
  startLocation: {
    type: String,
    required: true,
    trim: true
  },
  locationDescription: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  numberPeople: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    trim: true
  },
  status: {
    type: String,
    default: 'รอการตอบรับจากคนขับ',
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  targetVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  reqCreatedAt: {
    type: Date,
    required:true,
    default: () => Date.now()
  }
})

const Reg = mongoose.model("Request", RegSchema)

export default Reg 