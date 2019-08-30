import { sendMail } from '../../services/sendgrid'
import { contactEmail } from '../../config'
import Contact from './model'

export const create = ({ bodymen: {body: {email, name, subject, content}} }, res, next) => {
  Contact.create({email, name, subject, content})
    .then(newContact => {
      const contentMessage = `
        <b>Email de Contato</b> <br> 
        Data: ${newContact.createdAt} <br>
        De: ${email} <br>  
        Nome: ${name} <br><br> 
        Assunto: ${subject} <br><br> 
        
        Mensagem: ${content}
      `
      sendMail({ toEmail: contactEmail, subject: `Email de Contato - ${subject}`, content: contentMessage })
        .then(([response]) => response ? res.status(response.statusCode).end() : null)
        .catch(next)
    })
    .catch(err => next(err))
}
