

const fs = require('fs');
const lib = {}

lib.createFile = function(filepath, data) {  

  fs.writeFileSync(filepath, data, (err) => {      
    if (err) throw err;        
  });
}


module.exports = lib;