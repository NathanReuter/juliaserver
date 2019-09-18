import { sendMail } from '../../services/sendgrid'
import { contactEmail } from '../../config'

export const create = ({ bodymen: {body: {email, name, subject, content}} }, res, next) => {
  const contentMessage = `
        <b>Email de Contato</b> <br> 
        Data: ${Date.now()} <br>
        De: ${email} <br>  
        Nome: ${name} <br><br> 
        Assunto: ${subject} <br><br> 
        
        Mensagem: ${content}
      `
  sendMail({ toEmail: contactEmail, subject: `Email de Contato - ${subject}`, content: contentMessage })
    .then(([response]) => response ? res.status(response.statusCode).end() : null)
    .catch(next)
}


