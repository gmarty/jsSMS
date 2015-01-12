#!/usr/bin/env node;
/**
 * jsSMS - A Sega Master System/Game Gear emulator in JavaScript
 * Copyright (C) 2012  Guillaume Marty (https://github.com/gmarty)
 * Based on JavaGear Copyright (c) 2002-2008 Chris White
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

/**
 * This file is heavily inspired by n64.js.
 */

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var sync_fd = fs.openSync('./sync.bin', 'a+');

function writeSyncLog(offset, length, request, response) {
  offset = parseInt(offset, 10) || 0;
  length = parseInt(length, 10) || 1024;

  var data = [];
  var dataLen = 0;

  request.on('data', function(chunk) {
    data.push(chunk);
    dataLen += chunk.length;
  });

  request.on('end', function() {
    var buffer = new Buffer(dataLen);
    for (var i = 0, len = data.length, pos = 0; i < len; i++) {
      data[i].copy(buffer, pos);
      pos += data[i].length;
    }

    fs.writeSync(sync_fd, buffer, 0, dataLen, offset);
    //fs.truncateSync(sync_fd, offset + dataLen);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('OK', 'utf-8');
  });
}

function readSyncLog(offset, length, request, response) {
  offset = parseInt(offset, 10) || 0;
  length = parseInt(length, 10) || 1024;

  var buffer = new Buffer(length);

  fs.readSync(sync_fd, buffer, 0, length, offset);
  response.writeHead(200, {'Content-Type': 'application/octet-stream'});
  response.end(buffer, 'utf-8');
}

function serveFile(request, response) {
  var filePath = decodeURI('.' + request.url);
  var contentType = '';

  if (filePath === './') {
    // index.html is the default resource served.
    filePath = './index.html';
  }

  switch (path.extname(filePath)) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.woff':
      contentType = 'application/x-font-woff';
      break;
    case '.sms':
    case '.gg':
      contentType = 'application/octet-stream'; // as per RFC 2046.
      break;
    default:
      // Only serve file type we know about.
      response.writeHead(404);
      response.end();
      break;
  }

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        } else {
          response.writeHead(200, {'Content-Type': contentType});
          response.end(content, 'utf-8');
        }
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  });
}

http.createServer(function(request, response) {
  var parsed = url.parse(request.url, true);

  if (parsed.pathname === '/wsynclog') {
    if (request.method === 'POST') {
      writeSyncLog(parsed.query.o, parsed.query.l, request, response);
    } else {
      response.writeHead(500);
      response.end();
    }
    return;
  }

  if (parsed.pathname === '/rsynclog') {
    readSyncLog(parsed.query.o, parsed.query.l, request, response);
    return;
  }

  serveFile(request, response);
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');

process.on('SIGINT', function() {
  console.log('Got ctrl-c - exiting');
  process.exit();
});
