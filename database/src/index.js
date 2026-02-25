const { PrismaClient } = require("./generated/client");

// Inisiasi Prisma Client
const prisma = new PrismaClient();

// Export instance prisma agar bisa dipakai di app lain
module.exports = {
  prisma,
};
