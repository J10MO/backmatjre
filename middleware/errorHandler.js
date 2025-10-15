function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large',
      message: 'File size must be less than 5MB'
    });
  }

  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ 
      error: 'Invalid file type',
      message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
    });
  }

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(400).json({ 
      error: 'Duplicate entry',
      message: 'This record already exists'
    });
  }

  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = errorHandler;