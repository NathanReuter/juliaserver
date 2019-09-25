import { Router } from 'express'
import { create, index } from './controller'
import { middleware as body } from 'bodymen'
import { schema } from './model'
import {emailLeadContact} from '../../middleware/leadsContact'
import {token} from '../../services/passport';
import {middleware as query} from "querymen";

const { email, name, subject, content } = schema.tree
const router = new Router()

/**
 * @api {post} /contacts/contact Create contact email
 * @apiName CreateContact
 * @apiGroup Contact
 * @apiSuccess {Object} contact Contact's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contact not found.
 */
router.post('/contact',
  body({email, name, subject, content}),
  emailLeadContact,
  create)


/**
 * @api {post} /contacts/contact Create contact email
 * @apiName RetrieveUsersContacts
 * @apiGroup Contact
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object[]} users List of usersContacts.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contact not found.
 * @apiError 401 Admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

export default router
