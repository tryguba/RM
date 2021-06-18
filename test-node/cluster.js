const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const cpusCount = os.cpus().length;
  console.log(`CPUs: ${cpusCount}`);
  console.log(`Master started. Pid: ${process.pid}`);
  for (let i = 0; i < cpusCount - 1; i++) {
    const worker = cluster.fork();
    // worker.send('Hello from server!');
    // worker.on('message', (msg) => {
    //   console.log(`Message from worker ${worker.process.pid}: ${JSON.stringify(msg)}`);
    // });
  }
  cluster.on('exit', (worker, code) => {
    console.log(`Worker died! Pid: ${worker.process.pid}. Code: ${code}`);
    if (code === 1) {
      cluster.fork();
    }
  });
}

if (cluster.isWorker) {
  require('./worker.js');
  // process.on('message', (msg) => {
  //   console.log(`Message from master ${msg}`);
  // });
}

// kill procces PID ----   tskill <PID>
