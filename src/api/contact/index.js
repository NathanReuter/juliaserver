import { Router } from 'express'
import { create } from './controller'
import { middleware as body } from 'bodymen'
import { schema } from './model'

const { email, name, subject, content } = schema.tree
const router = new Router()

/**
 * @api {post} /contacts Create contact
 * @apiName CreateContact
 * @apiGroup Contact
 * @apiSuccess {Object} contact Contact's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contact not found.
 */
router.post('/',
  body({email, name, subject, content}),
  create)

export default router
