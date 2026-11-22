import { databaseName, initDatabase, pool, resetParticipations } from './db.js';

async function main() {
  try {
    await initDatabase(5);
    await resetParticipations();
    console.log(
      `[db:reset] Cleared participations and restarted ID sequence in database "${databaseName}".`
    );
  } catch (error) {
    console.error('[db:reset] Failed to reset database:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
