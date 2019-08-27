import mongoose, { Schema } from 'mongoose'

const types = ['course', 'book', 'other']

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  cover: {
    type: String
  },
  imgs: [{
    type: String
  }],
  type: {
    type: String,
    enum: types,
    required: true
  },
  description: {
    type: String,
    index: true,
    required: true
  },
  sku: {
    type: String
  },
  price: {
    type: Number,
    min: 0
  },
  oldprice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  creator: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

productSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      title: this.title,
      cover: this.cover,
      type: this.type,
      description: this.description,
      sku: this.sku,
      price: this.price,
      oldprice: this.oldprice,
      rating: this.rating
    }

    return full ? {
      ...view,
      // add properties for a full view
      imgs: this.imgs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: this.creator
    } : view
  }
}

const model = mongoose.model('Product', productSchema)

export const schema = model.schema
export default model
