const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('e-wallet-sentiment-database');
const crypto = require('crypto');
const ApiError = require('../../utils/api-error');

const login = async credentials => {
  const { username, email, password } = credentials;

  const orConditions = [];
  if (username) {
    orConditions.push({ username });
  }
  if (email) {
    orConditions.push({ email });
  }

  // Prepare query conditions
  const where = {};
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  // Find user by username or email
  const user = await prisma.user.findFirst({ where });

  if (!user) {
    throw ApiError.unauthorized('Email/Username atau password salah');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Email/Username atau password salah');
  }

  // Generate Access Token (60 minutes)
  const accessTokenPayload = {
    user_id: user.id,
    role: user.role,
    nama_user: user.username
  };

  const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  const accessToken = jwt.sign(accessTokenPayload, JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '60m',
    algorithm: 'HS256'
  });

  // Generate Refresh Token (7 days)
  const refreshTokenPayload = {
    user_id: user.id,
    jti: crypto.randomUUID()
  };

  const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
  const refreshToken = jwt.sign(refreshTokenPayload, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    algorithm: 'HS256'
  });

  // Hash refresh token for DB storage
  const tokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  // Calculate expiry date for DB
  const refreshExpirationDays = parseInt(
    process.env.JWT_REFRESH_EXPIRATION_DAYS || '7',
    10
  );
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + refreshExpirationDays);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      isRevoked: false,
      expiresAt
    }
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  };
};

module.exports = {
  login
};
