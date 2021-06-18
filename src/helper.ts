import WebTorrent, { Torrent } from 'webtorrent';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const staticFilesPath = path.join(__dirname, 'server/static-files/');
const torrentFilePath = path.join(__dirname, 'server/torrent-file/');

export const listFiles = (): void => {
  fs.readdir(staticFilesPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file, index) => {
      console.log(chalk.green.inverse(`${index + 1}. `, file));
    });
  });
};

export const createTorrentFile = (): void => {
  const client = new WebTorrent();
  fs.readdir(staticFilesPath, (err, files) => {
    if (!files.length) {
      console.log(chalk.red.inverse(`Static files are missing in the folder: ${staticFilesPath}`));
      process.exit();
    }
  });

  const file = fs.readdirSync(torrentFilePath)[0];
  const fileName = file?.split('.').slice(0, -1).join('.');
  client.seed(staticFilesPath, (torrent: Torrent) => {
    if (fileName === torrent.infoHash) {
      console.log(chalk.red.inverse(`Such a file already exists`));
      process.exit();
    }
    removeFiles(torrentFilePath);
    fs.writeFile(`${torrentFilePath}/${torrent.infoHash}.torrent`, torrent.torrentFile, () => {
      console.log(
        chalk.yellow.inverse(`Created new torrent file and added to folder: ${torrentFilePath}`),
      );
      process.exit();
    });
  });
};

export const removeFiles = (pathToFolder: string): void => {
  fs.readdir(pathToFolder, (err, files) => {
    if (!files.length) return;
    for (const file of files) {
      fs.unlink(path.join(pathToFolder, file), (err) => {
        if (err) throw err;
        console.log(chalk.blue.inverse('Removed old file'));
      });
    }
  });
};

export const openTorrentServer = (): void => {
  const client = new WebTorrent();
  client.seed(staticFilesPath, (torrent: Torrent) => {
    let interval = setInterval(() => {
      console.log(`upload ↗${(torrent.uploadSpeed / 1024 / 1024).toFixed(2)}Mb`);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });
};

export const openTorrentServer2 = (): void => {
  const PORT = 5555;
  const client = new WebTorrent();

  client.seed(staticFilesPath, (torrent: Torrent) => {
    console.log(chalk.blueBright(`torrent server is created on port:${PORT}...`));
    let server = torrent.createServer();
    server.listen(PORT);
  });
};
