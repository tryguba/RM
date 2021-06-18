import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import chalk from 'chalk';
import path from 'path';

export const torrentFilePath = path.join(__dirname, 'torrent-file/');

export const sendTorrentFile = async () => {
  const filename = fs.readdirSync(torrentFilePath)[0];
  if (filename) {
    const url = 'http://127.0.0.1:5050/upload';
    const form = new FormData();
    form.append('torrent', fs.createReadStream(`${__dirname}/torrent-file/${filename}`));
    fetch(url, {
      method: 'POST',
      body: form,
    })
      .then((res) => res.text())
      .then((data) => console.log(chalk.yellow.bgGray.bold(`${data}`)))
      .then(() => {
        process.exit();
      });
  } else {
    console.log(chalk.red.inverse('Missing torrent file'));
    process.exit();
  }
};
