const bcrypt = require('bcrypt');
async function run() {
    const adminHash = '$2b$10$nIufmWNHymdCD9Qcx/2il.WHFi6wA/BkYAVYF1Go6WtLQupDT2Zku';
    const match = await bcrypt.compare('Password123!', adminHash);
    console.log('Admin Hash Match Password123!: ', match);
}
run();
