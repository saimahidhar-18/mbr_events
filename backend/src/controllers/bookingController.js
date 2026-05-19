const prisma = require('../utils/prisma');
const { emit } = require('../socket');

async function createBooking(req, res, next) {
  const { items, eventDate, location, total } = req.body;
  const userId = req.user.userId;
  if (!items || !items.length) return res.status(400).json({ error: 'No items to book' });

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // For each item, check availability for the eventDate
      for (const it of items) {
        const item = await tx.item.findUnique({ where: { id: it.itemId } });
        if (!item) throw Object.assign(new Error('Item not found'), { status: 404 });

        // Sum existing booked qty for the same date (excluding cancelled)
        const aggregate = await tx.bookingItem.aggregate({
          _sum: { qty: true },
          where: {
            itemId: it.itemId,
            booking: { eventDate: new Date(eventDate), status: { not: 'cancelled' } }
          }
        });

        const bookedQty = aggregate._sum.qty || 0;
        if (bookedQty + it.qty > item.totalQty) {
          throw Object.assign(new Error(`Not enough inventory for item ${item.name}`), { status: 400 });
        }
      }

      // Create booking and booking items
      const b = await tx.booking.create({
        data: {
          userId,
          eventDate: new Date(eventDate),
          location,
          total,
          items: { create: items.map(i => ({ itemId: i.itemId, qty: i.qty, price: i.price })) }
        },
        include: { items: true }
      });

      return b;
    });

    emit('bookingCreated', booking);
    res.json({ booking });
  } catch (err) {
    next(err);
  }
}

async function listUserBookings(req, res, next) {
  try {
    const userId = req.user.userId;
    const bookings = await prisma.booking.findMany({ where: { userId }, include: { items: true, payment: true } });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBooking, listUserBookings };
