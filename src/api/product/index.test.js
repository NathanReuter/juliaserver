import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Product } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, book1, bookData, course1

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  bookData = {
    title: 'Planejamento Saudável',
    cover: '../assets/img/books/PlanejamentoSaudavel.png',
    imgs: ['../assets/img/books/PlanejamentoSaudavel.png', '../assets/img/books/PlanejamentoSaudavel.png'],
    type: 'book',
    description: 'Dicas de como se organizar para que mesmo com a correria\n' +
      '                                do dia-a-dia consiga manter a vida saudável.',
    sku: 1,
    price: 9.99,
    creator: 'Júlia B',
    rating: 5
  }
  book1 = await Product.create(bookData)
  course1 = await Product.create({...bookData, type: 'course', sku: '2', rating: 1, price: 2.22})
})

test('POST /products 201 (admin) - Creating a book', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession,
      ...bookData
    })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('Planejamento Saudável')
  expect(body.cover).toEqual('../assets/img/books/PlanejamentoSaudavel.png')
  expect(body.imgs).toEqual([ '../assets/img/books/PlanejamentoSaudavel.png',
    '../assets/img/books/PlanejamentoSaudavel.png' ])
  expect(body.type).toEqual('book')
  expect(typeof body.description).toEqual('string')
  expect(body.sku).toEqual('1')
  expect(body.price).toEqual(9.99)
  expect(body.oldprice).toEqual(undefined)
  expect(body.rating).toEqual(5)
})

test('POST /products 401 (user) - Users cant create products ', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /products 401 (public) - public cant creat products', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /products 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(2)
})

test('GET /products?type=course 200 - Filter by type', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ type: 'course' })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(1)
})

test('GET /products?type=course 200 - Filter bh rating', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ rating: 1 })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(1)
})

test('GET /products?type=course 200 - Filter bY price desc', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ sort: '-price' })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(body.rows.length).toBe(2)
})

test('GET /products/:id 200 - Getting book by id', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${book1.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(book1.id)
})

test('GET /products/:id 404 - Wrong id', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /products/:id 200 (admin) - Changing books name', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${book1.id}`)
    .send({ access_token: adminSession, title: 'New name' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('New name')
})

test('PUT /products/:id 200 (admin) - Changing books description', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${book1.id}`)
    .send({ access_token: adminSession, description: 'New description' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.description).toEqual('New description')
})

test('PUT /products/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${book1.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /products/:id 401 (public)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${book1.id}`)
  expect(status).toBe(401)
})

test('PUT /products/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, description: 'New description' })
  expect(status).toBe(404)
})

test('DELETE /products/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${book1.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /products/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${book1.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /products/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${book1.id}`)
  expect(status).toBe(401)
})

test('DELETE /products/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
