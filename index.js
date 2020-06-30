const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const port = process.env.PORT | 8080;

const app = express();

app.use(bodyParser.json())

fs.readdir("api", (err, files) => {
  files.forEach(file => {
    const match = /^(.*)\.js$/.exec(file);
    if (match) {
      const url = `/api/${match[1]}`;
      app.use(url, require(`./api/${file}`));
      process.stdout.write(`- created route ${url}\n`);
    }
  });
});

app.listen(port);
process.stdout.write(`Server listening on port ${port}\n`);
