const prisma = require('../utils/prisma');

async function listItems(req, res, next) {
  try {
    const items = await prisma.item.findMany({ include: { photos: true, category: true } });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

module.exports = { listItems };
