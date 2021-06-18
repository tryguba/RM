const os = require('os');
const http = require('http');

const server = http
  .createServer((req, res) => {
    for (let i = 0; i < 1e7; i++) {}
    res.end(`hello from node js! \n`);
  })
  .listen(8800, () => {
    console.log(`Worker started, Pid: ${process.pid}`);
  });

process.on('SIGINT', () => {
  console.log('Signal is SIGINT');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Signal is SIGTERM');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGUSR2', () => {
  console.log('Signal is SIGUSR2');
  server.close(() => {
    process.exit(1);
  });
});
