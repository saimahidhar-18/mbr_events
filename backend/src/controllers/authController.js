const prismaClient = require('../utils/prisma');
const { sendSms } = require('../services/twilioService');
const { signToken } = require('../utils/jwt');

async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await prismaClient.oTP.create({ data: { phone, code, expiresAt } });
    await sendSms(phone, `Your MBR Events OTP is ${code}`);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { phone, code, name } = req.body;
    const record = await prismaClient.oTP.findFirst({ where: { phone, code, used: false }, orderBy: { createdAt: 'desc' } });
    if (!record || new Date(record.expiresAt) < new Date()) return res.status(400).json({ error: 'Invalid or expired OTP' });
    await prismaClient.oTP.update({ where: { id: record.id }, data: { used: true } });
    let user = await prismaClient.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prismaClient.user.create({ data: { phone, name } });
    }
    const token = signToken({ userId: user.id, isAdmin: user.isAdmin });
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await prismaClient.user.findUnique({ where: { id: req.user.userId } });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

module.exports = { requestOtp, verifyOtp, me };
