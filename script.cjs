const fs = require('fs');
console.log("CWD:", process.cwd());
console.log("Files:", fs.readdirSync(process.cwd()));
console.log("Root:", fs.readdirSync('/'));
