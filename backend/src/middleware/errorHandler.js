export function notFoundHandler(_request, response) {
  response.status(404).json({
    error: 'Route not found',
  });
}

export function errorHandler(error, _request, response, _next) {
  console.error(error);
  response.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error',
  });
}
