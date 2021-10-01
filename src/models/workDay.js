import mongoose from "mongoose"

const WorkDaySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
})

const WorkDay = mongoose.model("WorkDay", WorkDaySchema)

export default WorkDay