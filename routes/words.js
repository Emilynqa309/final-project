var express = require('express');
var router = express.Router();
const Entry = require('../models/entry');


router.get('/entries', async (req, res) => {
  try {
    const filter = {};

    if (req.query.tag) {
      filter.tag = req.query.tag;
    }

    const entries = await Entry.find(filter).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

/**
 * POST /entries
 */
router.post('/entries', async (req, res) => {
  try {
    const entry = new Entry({
      text: req.body.text,
      tag: req.body.tag,
      song: req.body.song,
      stringColor: req.body.stringColor
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create entry' });
  }
});

module.exports = router;


  
  
  