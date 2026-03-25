const Bin = require('../models/Bin');
const User = require('../models/User');

// GET /api/bins
const getBins = async (req, res, next) => {
  try {
    const { status, assignedWorker } = req.query;
    const filter = { isActive: true };
    if (status) filter.status = status;
    if (assignedWorker) filter.assignedWorker = assignedWorker;

    const bins = await Bin.find(filter)
      .populate('assignedWorker', 'name email')
      .sort({ updatedAt: -1 });

    const stats = {
      total: await Bin.countDocuments({ isActive: true }),
      full: await Bin.countDocuments({ status: 'full', isActive: true }),
      medium: await Bin.countDocuments({ status: 'medium', isActive: true }),
      low: await Bin.countDocuments({ status: 'low', isActive: true }),
    };

    res.json({ success: true, bins, stats });
  } catch (error) {
    next(error);
  }
};

// POST /api/bins
const createBin = async (req, res, next) => {
  try {
    const { binId, location, fillLevel, assignedWorker } = req.body;

    const existing = await Bin.findOne({ binId: binId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Bin ID already exists' });
    }

    if (assignedWorker) {
      const worker = await User.findById(assignedWorker);
      if (!worker || worker.role !== 'worker') {
        return res.status(400).json({ success: false, message: 'Invalid worker assigned' });
      }
    }

    const bin = await Bin.create({ binId, location, fillLevel: fillLevel || 0, assignedWorker: assignedWorker || null });
    await bin.populate('assignedWorker', 'name email');

    res.status(201).json({ success: true, message: 'Bin created successfully', bin });
  } catch (error) {
    next(error);
  }
};

// PUT /api/bins/:id
const updateBin = async (req, res, next) => {
  try {
    const { location, fillLevel, assignedWorker } = req.body;
    const updateData = {};
    if (location !== undefined) updateData.location = location;
    if (fillLevel !== undefined) updateData.fillLevel = fillLevel;
    if (assignedWorker !== undefined) updateData.assignedWorker = assignedWorker || null;

    const bin = await Bin.findByIdAndUpdate(req.params.id, updateData, {
      new: true, runValidators: true,
    }).populate('assignedWorker', 'name email');

    if (!bin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }

    res.json({ success: true, message: 'Bin updated successfully', bin });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/bins/:id
const deleteBin = async (req, res, next) => {
  try {
    const bin = await Bin.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!bin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }
    res.json({ success: true, message: 'Bin removed successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /api/bins/update-level  (IoT device endpoint)
const updateLevel = async (req, res, next) => {
  try {
    const { binId, fillLevel } = req.body;

    if (!binId || fillLevel === undefined) {
      return res.status(400).json({ success: false, message: 'binId and fillLevel are required' });
    }

    if (fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({ success: false, message: 'fillLevel must be between 0 and 100' });
    }

    const bin = await Bin.findOneAndUpdate(
      { binId: binId.toUpperCase(), isActive: true },
      { fillLevel },
      { new: true, runValidators: true }
    ).populate('assignedWorker', 'name email');

    if (!bin) {
      return res.status(404).json({ success: false, message: `Bin with ID ${binId} not found` });
    }

    res.json({ success: true, message: 'Fill level updated', bin });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBins, createBin, updateBin, deleteBin, updateLevel };
