import mongoose from "mongoose"

const metaSchema = new mongoose.Schema({
    image: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: String,
    required: true,
    trim: true
  },
  idCard: {
    type: String,
    required: true,
    trim: true
  },
  driverlicense: {
    type: String,
    required: true,
    trim: true
  },
  idCardIm: {
    type: String,
    required: true,
    trim: true
  },
  driverlicenseIm: {
    type: String,
    required: true,
    trim: true
  },
  

  status: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

const Meta = mongoose.model("Metadata", metaSchema)

export default Meta 