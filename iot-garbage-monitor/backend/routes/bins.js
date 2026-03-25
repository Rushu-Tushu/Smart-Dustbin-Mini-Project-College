const express = require('express');
const { body } = require('express-validator');
const { getBins, createBin, updateBin, deleteBin, updateLevel } = require('../controllers/binController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// IoT device endpoint (no auth required - secured by knowing endpoint)
router.post('/update-level', [
  body('binId').notEmpty().withMessage('Bin ID is required'),
  body('fillLevel').isFloat({ min: 0, max: 100 }).withMessage('Fill level must be between 0 and 100'),
], validate, updateLevel);

router.use(protect);

router.get('/', getBins);

router.post('/', adminOnly, [
  body('binId').notEmpty().withMessage('Bin ID is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('fillLevel').optional().isFloat({ min: 0, max: 100 }).withMessage('Fill level must be between 0 and 100'),
], validate, createBin);

router.put('/:id', adminOnly, updateBin);
router.delete('/:id', adminOnly, deleteBin);

module.exports = router;
