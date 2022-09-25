
# Express Auth Package

This package used for authentication, for Express framework.
By using this package, you can use authenticated any route, if you needed you can add role authentication.



## Configuration Variables

To use this module, you will need to add the following parameters

- `extractFrom` - This field says, from where should getting JWT token, for this field you can use `ExpressAuthExtract` object from package. This field isn't required, default is getting token from *Header as a bearer token*
- `secretKey` - This field required, this value use for JWT verify.
- `roleKey` - This field is optional, this should use for role auth if needed.
- `customExtractor` - This field is optional too, this accepts a method, which you can use to extract token. 
   Custom extractor accept function with one parameter, that parameter is request object.
   
    Example is below
```javascript
function (request){
  // Do actions with request object
  // And return token as string
}
```
## Features

There are 2 main object in package:
- `ExpressAuth` this object used for configuration
- `ExpressAuthExtract` this object for setting type, from where should getting token

`ExpressAuthExtract` has 3 main values
- extractFromAuthHeaderAsBearerToken
- extractFromCookie - In this case cookie must have __token__ key
- extractFromQuery - In this case in query must exists __token__ key

## Installation

Install ExpressAuth with npm

```bash
  npm i @black_meteor/express-auth
```

## Usage/Examples

```javascript
const { ExpressAuth, ExpressAuthExtract } = require('./index');
const express = require('express');

const app = express();

const expressAuth = new ExpressAuth({
  extractFrom: ExpressAuthExtract.extractFromAuthHeaderAsBearerToken,
  secretKey: 'secret',
  roleKey: 'role'
})

app.get('/auth', expressAuth.AuthGuard, (req, res, next) => {
  res.status(200).send('Authenticated')
});

app.get('/auth/admin', expressAuth.RoleGuard('admin'), (req, res, next) => {
  res.status(200).send('Admin access')
});

app.listen(3000, () => console.log('Start'))

```

