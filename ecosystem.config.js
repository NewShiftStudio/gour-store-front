/* eslint-disable @typescript-eslint/no-var-requires */
const pack = require('./package.json');

require('dotenv').config({ path: './.env.local' });

module.exports = {
  apps: [
    {
      name: pack.name,
      script: 'yarn',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        PORT: process.env.PORT || 3500,
      },
    },
  ],
};
