import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import express from 'express';
import Busboy from 'busboy';
import WebTorrent, { Torrent } from 'webtorrent';
import { removeFiles } from '../helper';

const uploadFile = path.join(__dirname, 'uploads/');

export const parseTorrentFile = () => {
  const dir = `${__dirname}/parsed-files`;
  const client = new WebTorrent();
  const filename = fs.readdirSync(uploadFile)[0];

  client.add(`${uploadFile}/${filename}`, (torrent: Torrent) => {
    torrent.files.forEach((file) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      file.getBuffer((err, buffer) => {
        if (err) console.log(err);
        fs.writeFileSync(`${dir}/${file.name}`, buffer);
        console.log(chalk.yellow.inverse(`file: ${chalk.green(file.name)} saved... `));
      });
    });
    setInterval(() => {
      console.log(`download ↙${(torrent.downloadSpeed / 1024 / 1024).toFixed(2)}Mb`);
      console.log(`${torrent.length}: ${torrent.downloaded}`);
      if (+torrent.length === +torrent.downloaded) {
        console.log('Downloaded!!!!!!!!');
        process.exit();
      }
    }, 1000);
  });
};

export const runClient = () => {
  const app = express();
  const HOST = 'http://127.0.0.1';
  const PORT = 5050;

  app.post('/upload', (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const uploadedFile = fs.readdirSync(uploadFile)[0];
      if (uploadedFile === filename) {
        return res.end('Such a file already exists');
      }
      if (mimetype === 'application/x-bittorrent') {
        removeFiles(uploadFile);
        const saveTo = path.join(`${__dirname}/uploads`, path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
      } else {
        return res.end('must be torrent file');
      }
    });
    busboy.on('finish', () => {
      res.writeHead(200, { Connection: 'close' });
      res.end('File saved.');
    });
    return req.pipe(busboy);
  });
  app.listen(PORT, () => {
    console.log(chalk.blue(`Listening on ${HOST}:${PORT}...`));
  });
};