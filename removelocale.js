const fs = require('fs');
const path = require('path');

const directory = 'lib\\locale';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
	if(file!="en_US.js") {  
		fs.unlink(path.join(directory, file), err => {
		  if (err) throw err;
		});
	}
  }
});