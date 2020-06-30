#!/usr/bin/env node

const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT | 8080;
const dir = `${process.cwd()}/api`;
const lambdas = {};

/** Lambda function loader **/

let lastModified = 0;
const loader = () => {
  const currentLastModified = fs.readdirSync(dir).map(file => fs.statSync(`${dir}/${file}`).mtimeMs).reduce((acc, cur) => Math.max(acc, cur), 0);
  if (currentLastModified > lastModified) {
    lastModified = currentLastModified;
    Object.keys(lambdas).forEach(function(key) { delete lambdas[key]; });
    fs.readdirSync(dir).forEach(file => {
      const match = /^(.*)\.js$/.exec(file);
      if (match) {
        const url = `/api/${match[1]}`;
        delete require.cache[`${dir}/${file}`];
        lambdas[url] = require(`${dir}/${file}`);
        process.stdout.write(`Created route ${url}\n`);
      }
    });
  }
}
setInterval(loader, 1000);
setImmediate(loader);

/** Express server **/

const app = express();

app.use(bodyParser.json());

app.use((req, res) => {
  if (lambdas.hasOwnProperty(req.path)) {
    try {
      const result = lambdas[req.path](req, res);
      if (result.catch) {
        result.catch(e => res.status(500).send(e.message));
      }
    } catch(e) {
      res.status(500).send(e.message);
    }
  } else {
    res.status(404).send("Not found");
  }
});

app.listen(port);
process.stdout.write(`Server listening on port ${port}\n`);
