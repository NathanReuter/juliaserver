import mongoose, { Schema } from 'mongoose'

const contact = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    trim: true,
    lowercase: true
  },
  name: { type: String },
  subject: { type: String },
  content: { type: String, required: true }
}, {
  timestamps: true
})

contact.methods = {
  view () {
    const view = {
      email: this.email,
      name: this.name,
      subject: this.subject,
      content: this.content
    }

    return {
      ...view
    }
  }
}

const model = mongoose.model('Contact', contact)

export const schema = model.schema
export default model
