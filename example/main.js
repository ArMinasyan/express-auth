const { ExpressAuth, ExpressAuthExtract } = require('../index');
const express = require('express')

const app = express();

const expressAuth = new ExpressAuth({
  extractFrom: ExpressAuthExtract.extractFromAuthHeaderAsBearerToken,
  secretKey: 'secret',
  roleKey: 'role'
})

app.get('/auth', expressAuth.AuthGuard, (req, res) => {
  res.send('Authenticated')
});

app.get('/auth/admin', expressAuth.RoleGuard('admin'), (req, res) => {
  res.send('Admin access')
});

app.listen(3000, () => console.log('Start'))
