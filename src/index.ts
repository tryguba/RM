import yargs from 'yargs';
import { createTorrentFile, listFiles, openTorrentServer, openTorrentServer2 } from './helper';
import { parseTorrentFile, runClient } from './client/client';
import chalk from 'chalk';
import { sendTorrentFile } from './server/server';

yargs
.command( {
  command: 'parse',
  describe: 'parse torrent file',
  handler() {
    console.log( chalk.blueBright( 'parse torrent file' ) );
    parseTorrentFile();
  },
} )
.command( {
  command: 'create',
  describe: 'create torrent file',
  handler() {
    console.log( chalk.blueBright( 'creating torrent file' ) );
    createTorrentFile();
  },
} )
.command( {
  command: 'open',
  describe: 'open torrent server',
  handler() {
    console.log( chalk.blueBright( 'open torrent server' ) );
    openTorrentServer();
  },
} )
.command( {
  command: 'open2',
  describe: 'open torrent server2',
  handler() {
    console.log( chalk.blueBright( 'open torrent server2' ) );
    openTorrentServer2();
  },
} )
.command( {
  command: 'list',
  describe: 'show list static files',
  handler() {
    console.log( chalk.blueBright( 'show list static files' ) );
    listFiles();
  },
} )
.command( {
  command: 'send-file',
  describe: 'send torrent file',
  aliases: [ 'sf' ],
  builder: ( yargs ) => yargs,
  handler() {
    console.log( chalk.blueBright( 'sending torrent file' ) );
    sendTorrentFile();
  },
} )
.command( {
  command: 'client',
  describe: 'start server',
  handler() {
    console.log( chalk.blueBright( `start client server` ) );
    runClient();
  },
} );

yargs.parse();
