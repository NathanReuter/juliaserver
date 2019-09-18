import mongoose, { Schema } from 'mongoose'

const userContact = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    trim: true,
    lowercase: true
  },
  contactEmails: [{
    name: { type: String },
    subject: { type: String },
    content: { type: String }
  }],
  leadsAction: [String],
  blacklist: {type: Boolean}
}, {
  timestamps: true
})

userContact.methods = {
  view () {
    const view = {
      email: this.email,
      contactEmails: this.contactEmails,
      leadsAction: this.leadsAction,
      blacklist: this.blacklist
    }

    return {
      ...view
    }
  }
}

const model = mongoose.model('UserContact', userContact)

export const schema = model.schema
export default model
