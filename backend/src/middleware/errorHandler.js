module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  
  // Log to terminal
  console.error("=== BACKEND ERROR ===");
  console.error(err);
  console.error("=====================");

  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      
      message: err.message || 'Internal server error',
    },
  });
};