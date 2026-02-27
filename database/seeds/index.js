const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const result = dotenv.config({ path: path.join(__dirname, '../.env') });

if (result.error) {
    console.error('Failed to load .env file:', result.error);
}

const dbUrl = process.env.DATABASE_URL;

const { PrismaClient } = require('../src/generated/client');

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding reviews...');

    const sampleReviews = [
        { id: 'rev_001', user: 'Budi Santoso', content: 'Aplikasi sangat membantu untuk transfer antar bank tanpa biaya.', score: 5, source: 'Google Play' },
        { id: 'rev_002', user: 'Siti Aminah', content: 'UI/UX nya simpel dan elegan, suka banget sama dark modenya.', score: 4, source: 'App Store' },
        { id: 'rev_003', user: 'Andi Wijaya', content: 'Sering ada promo cashback yang menarik, lumayan buat jajan.', score: 5, source: 'Google Play' },
        { id: 'rev_004', user: 'Lestari Putri', content: 'Kadang loadingnya agak lama kalau pas sinyal lagi kurang stabil.', score: 3, source: 'Google Play' },
        { id: 'rev_005', user: 'Rian Hidayat', content: 'Top up saldo gampang banget lewat minimarket atau mobile banking.', score: 5, source: 'App Store' },
        { id: 'rev_006', user: 'Dewi Sartika', content: 'Customer servicenya responsif saat ada kendala transaksi pending.', score: 4, source: 'Google Play' },
        { id: 'rev_007', user: 'Fajar Ramadhan', content: 'Fitur bayar tagihan lengkap banget, dari listrik sampai asuransi.', score: 5, source: 'Google Play' },
        { id: 'rev_008', user: 'Anisa Bahar', content: 'Verifikasi akunnya cepat, tidak sampai 24 jam sudah beres.', score: 5, source: 'App Store' },
        { id: 'rev_009', user: 'Bambang Pamungkas', content: 'Kadang ada bug saat scan QRIS, tapi jarang terjadi sih.', score: 3, source: 'Google Play' },
        { id: 'rev_010', user: 'Eka Saputra', content: 'Sangat recommended untuk yang cari e-wallet praktis dan aman.', score: 5, source: 'Google Play' }
    ];

    for (const data of sampleReviews) {
        const review = await prisma.review.upsert({
            where: { review_id: data.id },
            update: {},
            create: {
                review_id: data.id,
                user_name: data.user,
                content: data.content,
                score: data.score,
                source: data.source,
                timestamp_unix: BigInt(Date.now()),
                is_analyzed: false,
                created_at: new Date(),
            },
        });
        console.log(`Seeded review: ${review.review_id}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
