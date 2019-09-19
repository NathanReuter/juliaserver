import { success, notFound } from '../../services/response/'
import { Product } from '.'
import { sendMail } from '../../services/sendgrid'
import { contactEmail } from '../../config'

exports.params = function (req, res, next, id) {
  Product.findById(id)
    .then(product => {
      if (!product) {
        next(new Error('No product with that id'))
      } else {
        req.product = product
        next()
      }
    }, function (err) {
      next(err)
    })
}

export const create = ({ bodymen: { body } }, res, next) =>
  Product.create(body)
    .then((product) => product.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  Product.count(query)
    .then(count => Product.find(query, select, cursor)
      .then((products) => ({
        count,
        rows: products.map((product) => product.view())
      }))
    )
    .then(success(res))
    .catch(next)
}
export const show = (fullView) => ({ params }, res, next) =>
  Product.findById(params.id)
    .then(notFound(res))
    .then((product) => product ? product.view(fullView) : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) => {
  Product.findById(params.id)
    .then(notFound(res))
    .then((product) => product ? Object.assign(product, body).save() : null)
    .then((product) => product ? product.view(true) : null)
    .then(success(res))
    .catch(next)
}


export const destroy = ({ params }, res, next) =>
  Product.findById(params.id)
    .then(notFound(res))
    .then((product) => product ? product.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const createDowloadEmail = ({ bodymen: { body: { email } }, params, product }, res, next) => {
  const contentMessage = (name, link) => `
        <b>Email de Contato</b> <br> 
        Obrigada por adquirir o <b>${name}</b>!!<br>
        Tenho certeza que você irá gostar e o conteúdo lhe será muito util.
        <br><br>
        Link para acesso:
        <a href="${link}">${link}</a>
        <br><br>
        <small>*<i>Qualquer dúvida, feedback ou até um elogio, nao exite em entrar em contato em ${contactEmail}</i></small>
      `
  if (!product) {
    notFound(res)
  }

  sendMail({
    toEmail: email,
    subject: `Acesso ao Produto - Link para download do "${product.title}"`,
    content: contentMessage(product.title, product.link)
  })
    .then(([response]) => response ? res.status(response.statusCode).end() : null)
    .catch(next)
}
