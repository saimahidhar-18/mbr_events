const prisma = require('../utils/prisma');
const { emit } = require('../socket');

async function updateInventory(req, res, next) {
  try {
    const { id } = req.params;
    const { totalQty, markUnavailable } = req.body;

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const data = {};
    if (typeof totalQty === 'number') data.totalQty = totalQty;
    if (typeof markUnavailable === 'boolean') data.totalQty = markUnavailable ? 0 : item.totalQty;

    const updated = await prisma.item.update({ where: { id }, data });
    emit('inventoryUpdated', { itemId: id, updated });
    res.json({ updated });
  } catch (err) {
    next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const items = await prisma.item.findMany({ include: { photos: true, category: true } });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

module.exports = { updateInventory, listAll };
