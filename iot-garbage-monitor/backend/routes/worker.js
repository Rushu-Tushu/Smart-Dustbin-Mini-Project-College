const express = require('express');
const { getWorkerTasks, markBinCleaned } = require('../controllers/workerController');
const { protect, workerOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, workerOrAdmin);

router.get('/tasks', getWorkerTasks);
router.put('/complete/:id', markBinCleaned);

module.exports = router;
