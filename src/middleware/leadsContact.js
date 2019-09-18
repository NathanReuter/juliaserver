import UserContact from '../api/contact/model'

const emailLeadContact = (req, res, next) => {
  const bodymen = req.bodymen

  if (bodymen && bodymen.body) {
    const {email, name, subject, content} = bodymen.body
    const userContact = {email, contactEmails: [{name, subject, content}]}
    UserContact.findOneAndUpdate(email).then((model) => {
      if (!model) {
        UserContact.create(userContact)
          .then(res => {
            console.log(res)
          })
      } else {
        model.contactEmails.push(userContact.contactEmails[0])
        model.save()
      }
    })
    // console.log(email, name, subject, content)
  }

  next()
}

const simpleLeadContact = (lead) => (req, res, next) => {
  const bodymen = req.bodymen

  if (bodymen && bodymen.body) {
    const {email} = bodymen.body
    UserContact.findOneAndUpdate(email).then((model) => {
      if (!model) {
        UserContact.create({email})
          .then(res => {
            console.log(res)
          })
      } else {
        model.leadsAction.push(lead)
        model.save()
      }
    })
    // console.log(email, name, subject, content)
  }

  next()
}

export {emailLeadContact, simpleLeadContact}
