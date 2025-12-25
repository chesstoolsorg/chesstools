module.exports = {
  apps: [{
    name: 'chesstools',
    script: 'npm',
    args: 'run start -- -p 3001',
    cwd: '/root/chesstools/chesstools',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/chesstools-error.log',
    out_file: '/var/log/chesstools-out.log',
    log_file: '/var/log/chesstools.log',
    time: true
  }]
};
