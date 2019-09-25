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
  }

  next()
}

const simpleLeadContact = (action, target) => (req, res, next) => {
  const bodymen = req.bodymen
  const targetModel = req[target]
  const leadAction = {action, target: targetModel._id}

  if (bodymen && bodymen.body) {
    const {email} = bodymen.body
    UserContact.findOne({email}).then((model) => {
      if (!model) {
        UserContact.create({email, leadsAction: [leadAction]})
      } else {
        model.leadsAction.push(leadAction)
        model.save()
      }
    })
  }

  next()
}

export {emailLeadContact, simpleLeadContact}
