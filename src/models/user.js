import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
  providerId: {
    type: String,
  },
  metadata: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metadata"
    }
  ],
  vehicles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle"
    }
  ],
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request"
    }
  ],
  workDay: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkDay"
    }
  ],
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  userCreatedAt: {
    type: Date,
    required: true,
    default: () => Date.now()
  }
})

const User = mongoose.model("User", UserSchema)

export default User