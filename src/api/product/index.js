import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Product, { schema } from './model'

const router = new Router()
const { title, cover, imgs, type, description, sku, price, oldprice, rating, creator, link} = schema.tree

/**
 * @api {post} /products Create product
 * @apiName CreateProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam title Product's title.
 * @apiParam cover Product's cover.
 * @apiParam imgs Product's imgs.
 * @apiParam type Product's type.
 * @apiParam description Product's description.
 * @apiParam sku Product's sku.
 * @apiParam price Product's price.
 * @apiParam oldprice Product's oldprice.
 * @apiParam rating Product's rating.
 * @apiParam creator Product's ceator.
 * @apiSuccess {Object} product Product's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ title, cover, imgs, type, description, sku, price, oldprice, rating, creator, link }),
  create)

/**
 * @api {get} /products Retrieve products
 * @apiName RetrieveProducts
 * @apiGroup Product
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of products.
 * @apiSuccess {Object[]} rows List of products.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query({ type: String, rating: Number }),
  index)

/**
 * @api {get} /products/:id Retrieve product
 * @apiName RetrieveProduct
 * @apiGroup Product
 * @apiSuccess {Object} product Product's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 */
router.get('/:id',
  show(true))

/**
 * @api {put} /products/:id Update product
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam title Product's title.
 * @apiParam cover Product's cover.
 * @apiParam imgs Product's imgs.
 * @apiParam type Product's type.
 * @apiParam description Product's description.
 * @apiParam sku Product's sku.
 * @apiParam price Product's price.
 * @apiParam rating Product's rating.
 * @apiSuccess {Object} product Product's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Product not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({
    title: {
      type: String
    },
    cover,
    imgs,
    description: {
      type: String
    },
    price,
    rating }),
  (req, res, next) => {
    // Middleware to clean undefined values
    const bodymen = req.body
    Object.keys(bodymen).forEach(key => bodymen[key] === undefined && delete bodymen[key])
    req.bodymen = { body: bodymen }
    next()
  },
  update)

/**
 * @api {delete} /products/:id Delete product
 * @apiName DeleteProduct
 * @apiGroup Product
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Product not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
