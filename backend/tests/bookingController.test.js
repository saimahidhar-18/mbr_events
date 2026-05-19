const bookingController = require('../src/controllers/bookingController');
const prisma = require('../src/utils/prisma');

jest.mock('../src/utils/prisma', () => ({
  $transaction: jest.fn(),
  booking: { findMany: jest.fn() },
  bookingItem: { aggregate: jest.fn() },
  item: { findUnique: jest.fn() },
}));

describe('createBooking availability checks', () => {
  afterEach(() => jest.clearAllMocks());

  test('prevents booking when not enough inventory', async () => {
    const req = { body: { items: [{ itemId: 'item1', qty: 30 }], eventDate: '2026-06-01', location: 'Loc', total: 100 }, user: { userId: 'user1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // item exists with totalQty 40, but 20 already booked => remaining 20 < requested 30
    prisma.$transaction.mockImplementation(async (fn) => {
      // mock inside transaction behavior
      const tx = {
        item: { findUnique: async () => ({ id: 'item1', name: 'Chair', totalQty: 40 }) },
        bookingItem: { aggregate: async () => ({ _sum: { qty: 20 } }) },
        booking: { create: jest.fn() }
      };
      return fn(tx);
    });

    await bookingController.createBooking(req, res, next);

    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.message).toMatch(/Not enough inventory/);
  });

  test('creates booking when inventory is sufficient', async () => {
    const req = { body: { items: [{ itemId: 'item1', qty: 10 }], eventDate: '2026-06-01', location: 'Loc', total: 100 }, user: { userId: 'user1' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    prisma.$transaction.mockImplementation(async (fn) => {
      const tx = {
        item: { findUnique: async () => ({ id: 'item1', name: 'Chair', totalQty: 40 }) },
        bookingItem: { aggregate: async () => ({ _sum: { qty: 20 } }) },
        booking: { create: async (data) => ({ id: 'b1', ...data.data }) }
      };
      return fn(tx);
    });

    await bookingController.createBooking(req, res, next);

    expect(res.json).toHaveBeenCalled();
    const output = res.json.mock.calls[0][0];
    expect(output.booking).toBeDefined();
    expect(output.booking.items.length).toBe(1);
  });
});
