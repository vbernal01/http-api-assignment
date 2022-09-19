const respond = (request, response, content, status, type) => {
  // set status code (200 success) and content type
  response.writeHead(status, { 'Content-Type': type });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};
const sendJSONResponse = (request, response, text, id, status) => {
  const responseJSON = {
    message: text,
    id,
  };
  const responseContent = JSON.stringify(responseJSON);
  return respond(request, response, responseContent, status, 'application/json');
};

const sendXMLResponse = (request, response, text, id, status) => {
  const responseXML = `<response><id>${id}</id><message>${text}</message></response>`;
  return respond(request, response, responseXML, status, 'text/xml');
};
// function to show a success status code
const success = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    return sendXMLResponse(request, response, 'This is a successful response', 'Success', 200);
  }
  return sendJSONResponse(request, response, 'This is a successful response', 'Success', 200);
};

const badRequest = (request, response, acceptedTypes, params) => {
  if (!params.valid || params.valid !== 'true') {
    if (acceptedTypes[0] === 'text/xml') {
      return sendXMLResponse(request, response, 'Missing valid query parameter set to true', 'badRequest', 400);
    }
    return sendJSONResponse(request, response, 'Missing valid query parameter set to true', 'badRequest', 400);
  }

  if (acceptedTypes[0] === 'text/xml') {
    return sendXMLResponse(request, response, 'This is a valid response', 'Success', 200);
  }
  return sendJSONResponse(request, response, 'This is a valid response', 'Success', 200);
};

const unauthorized = (request, response, acceptedTypes, params) => {
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    if (acceptedTypes[0] === 'text/xml') {
      return sendXMLResponse(request, response, 'Missing loggedIn query parameter set to yes', 'Unauthorized', 401);
    }
    return sendJSONResponse(request, response, 'Missing loggedIn query parameter set to yes', 'Unauthorized', 401);
  }

  if (acceptedTypes[0] === 'text/xml') {
    return sendXMLResponse(request, response, 'This request has the required parameters', 'Success', 200);
  }
  return sendJSONResponse(request, response, 'This request has the required parameters', 'Success', 200);
};

const forbidden = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    return sendXMLResponse(request, response, 'You do not have access to this content', 'Forbidden', 403);
  }
  return sendJSONResponse(request, response, 'You do not have access to this content', 'Forbidden', 403);
};

const internal = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    return sendXMLResponse(request, response, 'Internal Server Error. Something went wrong', 'Internal Server Error', 500);
  }
  return sendJSONResponse(request, response, 'Internal Server Error. Something went wrong', 'Internal Server Error', 500);
};

const nonImplemented = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    return sendXMLResponse(request, response, 'A get request for this page has not been implemented yet. Check again later for updated content', 'Not Implemented', 501);
  }
  return sendJSONResponse(request, response, 'A get request for this page has not been implemented yet. Check again later for updated content', 'Not Implemented', 501);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  nonImplemented,
  respond,
};
