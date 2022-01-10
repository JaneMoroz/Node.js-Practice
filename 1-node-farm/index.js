const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////////////////////////////
// Building Simple API
/////////////////////////////////////////////////////////////////////////

// Get templates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// Get data and store it in dataObj
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Use slugify module
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

// Create Server
const server = http.createServer((req, res) => {
  // Routing
  const baseURL = `https://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  const pathname = requestURL.pathname;
  const query = requestURL.searchParams.get('id');

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query];
    output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>This page cannot be found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});

// Creating Simple Web Server
/////////////////////////////////////////////////////////////////////////

// const http = require("http");
// const url = require("url");

// // Create Server
// const server = http.createServer((req, res) => {
//   // Routing
//   const pathName = req.url;

//   if (pathName === "/" || pathName === "/overview") {
//     res.end("This is the OVERVIEW");
//   } else if (pathName === "/product") {
//     res.end("This is the PRODUCT");
//   } else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "my-own-header": "hello-world",
//     });
//     res.end("<h1>This page cannot be found</h1>");
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to requests on port 8000");
// });
/////////////////////////////////////////////////////////////////////////
//Reading and Writing Files
/////////////////////////////////////////////////////////////////////////

// // To Access File System
// const fs = require("fs");

// // Blocking, synchronous way
// // Get data from the file
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// // Write data in the file
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log('File written');

// // Non-blocking, asynchronous way
// // Get data from the file
// fs.readFile("./txt/start.txt", 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', "utf-8", (err, data3) => {
//       console.log(data3);

//       // Write data in the file
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written🎅');
//       })
//     });
//   });
// });
// console.log('Will read file');

/////////////////////////////////////////////////////////////////////////
//Intro
/////////////////////////////////////////////////////////////////////////

// const hello = "Hello world";
// console.log(hello);
