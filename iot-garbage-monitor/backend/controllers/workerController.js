const Bin = require('../models/Bin');

// GET /api/worker/tasks
const getWorkerTasks = async (req, res, next) => {
  try {
    const bins = await Bin.find({
      assignedWorker: req.user._id,
      isActive: true,
    })
      .populate('assignedWorker', 'name email')
      .sort({ fillLevel: -1 }); // Priority: highest fill level first

    res.json({ success: true, bins });
  } catch (error) {
    next(error);
  }
};

// PUT /api/worker/complete/:id
const markBinCleaned = async (req, res, next) => {
  try {
    const bin = await Bin.findOne({ _id: req.params.id, assignedWorker: req.user._id });

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found or not assigned to you',
      });
    }

    bin.fillLevel = 0;
    // status auto-updates via pre-save hook
    await bin.save();
    await bin.populate('assignedWorker', 'name email');

    res.json({ success: true, message: 'Bin marked as cleaned', bin });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkerTasks, markBinCleaned };
