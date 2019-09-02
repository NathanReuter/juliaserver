/* Creates the first admin user */

import User from './api/user/model'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}
const Seeds = () => {
  const user = {
    email: requireProcessEnv('SEED_EMAIL'),
    password: requireProcessEnv('SEED_PASS'),
    role: 'admin'
  }

  User.exists({ email: user.email })
    .then(exists => {
      if (!exists) {
        User.create(user)
          .then(console.log('- Seed Created'))
      }
    })
}

export default Seeds
