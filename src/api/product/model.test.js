import { Product } from '.'

let product

beforeEach(async () => {
  product = await Product.create(
    { title: 'test',
      cover: 'http://url.com/cover',
      imgs: ['http://url.com/img1', 'http://url.com/img2'],
      type: 'course',
      description: 'some description',
      sku: '1',
      price: 200,
      oldprice: 199,
      rating: 5,
      creator: 'Júlia B.'})
})

describe('view', () => {
  it('returns simple view', () => {
    const view = product.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(product.id)
    expect(view.title).toBe(product.title)
    expect(view.cover).toBe(product.cover)
    expect(view.type).toBe(product.type)
    expect(view.description).toBe(product.description)
    expect(view.sku).toBe(product.sku)
    expect(view.price).toBe(product.price)
    expect(view.oldprice).toBe(product.oldprice)
    expect(view.rating).toBe(product.rating)
  })

  it('returns full view', () => {
    const view = product.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(product.id)
    expect(view.title).toBe(product.title)
    expect(view.cover).toBe(product.cover)
    expect(view.imgs).toBe(product.imgs)
    expect(view.type).toBe(product.type)
    expect(view.description).toBe(product.description)
    expect(view.sku).toBe(product.sku)
    expect(view.price).toBe(product.price)
    expect(view.oldprice).toBe(product.oldprice)
    expect(view.rating).toBe(product.rating)
    expect(view.creator).toBe(product.creator)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
