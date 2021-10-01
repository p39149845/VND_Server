import mongoose from "mongoose"

const AdminSchema = new mongoose.Schema({
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
  providerId: {
    type: String,
  }
})

const Admin = mongoose.model("Admin", AdminSchema)

export default Admin