// routes/matchStreamRoutes.js
const router = require('express').Router();
const authenticateUser = require('../middlewares/authenticateUser');
const authorizeRoles = require('../middlewares/checkRole');
const Match = require('../models/customMatch-model');

router.post('/:id/start-stream',
  authenticateUser, authorizeRoles('admin','team_owner'),
  async (req, res) => {
    const m = await Match.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Match not found' });
    m.stream = { isLive: true, roomId: String(m._id), startedBy: req.userId, startedAt: new Date() };
    await m.save();
    res.json({ ok: true, match: m });
  }
);

router.post('/:id/stop-stream',
  authenticateUser, authorizeRoles('admin','team_owner'),
  async (req, res) => {
    const m = await Match.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Match not found' });
    m.stream = { isLive: false, roomId: null, startedBy: null, startedAt: null };
    await m.save();
    res.json({ ok: true, match: m });
  }
);

module.exports = router;
