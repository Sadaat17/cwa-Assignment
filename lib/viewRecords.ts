import sequelize from './db';
import GameCompletion from '../models/GameCompletion';

async function viewRecords() {
    try {
        console.log('🔄 Connecting to database...\n');
        await sequelize.authenticate();

        const records = await GameCompletion.findAll({
            order: [['id', 'ASC']],
        });

        if (records.length === 0) {
            console.log('📭 No records found in the database.\n');
        } else {
            console.log(`📊 Found ${records.length} record(s) in the database:\n`);
            console.log('═'.repeat(120));
            console.log(`${'ID'.padEnd(6)} | ${'User Name'.padEnd(20)} | ${'Status'.padEnd(12)} | ${'Time'.padEnd(8)} | ${'Challenges'.padEnd(15)} | ${'Created At'.padEnd(30)}`);
            console.log('═'.repeat(120));

            records.forEach((record) => {
                const id = String(record.id).padEnd(6);
                const userName = record.userName.padEnd(20);
                const status = record.completionStatus.padEnd(12);
                const time = record.timeTaken ? `${record.timeTaken}s`.padEnd(8) : 'N/A'.padEnd(8);
                const challenges = `${record.challengesCompleted || 0}/${record.totalChallenges || 0}`.padEnd(15);
                const createdAt = record.createdAt.toLocaleString().padEnd(30);

                console.log(`${id} | ${userName} | ${status} | ${time} | ${challenges} | ${createdAt}`);
            });
            console.log('═'.repeat(120));
            console.log('');
        }

        await sequelize.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

viewRecords();

