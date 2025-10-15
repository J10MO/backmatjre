const express = require('express');
const router = express.Router();
const {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
  incrementViewCount,
  incrementClickCount,
  getHomepageAds
} = require('../controllers/adsController');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// Routes for everyone (public)
router.get('/homepage', getHomepageAds);
router.patch('/:id/view', incrementViewCount);
router.patch('/:id/click', incrementClickCount);

// Routes for authenticated users
router.get('/', getAllAds);
router.get('/:id', getAdById);

// Routes for admin only
router.post('/', authenticateJWT, isAdmin, createAd);
router.put('/:id', authenticateJWT, isAdmin, updateAd);
router.delete('/:id', authenticateJWT, isAdmin, deleteAd);

module.exports = router;