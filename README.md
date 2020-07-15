# lambda
Minimalist lambda function server base on express.

## Description
It will watch and load `.js` files in `./api` folder.

Lambda functions are similar to express.js middlewares.

Example:
```
module.exports = (req, res) => {
  res.status(200).send('Hello world');
}
``` 

## Installation

```
$ npm i
```

## Running

To start the lambda function server:
```
$ npm start
```

It can also be run using npx:
```
$ npx git+ssh://github.com:stefancosquer/lambda.git
```
