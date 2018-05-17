'use strict'

const fs = require('fs');
const loop = require('./loop');
const homedir = process.env.HOME;
const finalDir = `${homedir}/data/in`;

loop.mainLoop();

fs.watch(finalDir, { encoding: 'buffer' }, (eventType, filename) => {
  if (eventType === 'change') {    
    loop.mainLoop();
  }  
});










