const { z } = require('zod');

const loginSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email('Format email tidak valid').optional(),
    password: z.string().min(1, 'Password wajib diisi')
  })
  .refine(data => data.username || data.email, {
    message: 'Username atau email wajib diisi',
    path: ['username']
  });

module.exports = {
  loginSchema
};
