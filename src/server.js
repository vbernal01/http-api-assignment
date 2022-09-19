const http = require('http');
const url = require('url');
const query = require('querystring');
const statusResponse = require('./statusResponses.js');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.loadCSS,
  '/success': statusResponse.success,
  '/badRequest': statusResponse.badRequest,
  '/unauthorized': statusResponse.unauthorized,
  '/forbidden' : statusResponse.forbidden,
  '/internal': statusResponse.internal,
  '/notImplemented': statusResponse.nonImplemented,
  notFound: jsonHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const params = query.parse(parsedUrl.query);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
