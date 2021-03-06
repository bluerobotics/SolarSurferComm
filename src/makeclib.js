// load modules
var fs = require('fs');
var Message = require('./Message.js');
Message.loadConfigFile();

// variables
var dir = 'output/';
var filename = 'Messages.h';

// init file contents
var clib = '';

// add stuff at top
clib += '#ifndef MESSAGES_H630903\n';
clib += '#define MESSAGES_H630903\n\n';
clib += '/* This file was automatically generated. DO NOT EDIT! */\n\n';
clib += '#include <WProgram.h>\n\n';
clib += 'namespace MessageType {\n\n';

// build header filer
Object.keys(Message.formats).forEach(function(i) {
  var format = Message.formats[i];
  clib += 'struct ';
  clib += format.name.replace('/','') + ' {\n';
  Object.keys(format.payload).forEach(function(j) {
  	var payload = format.payload[j];
  	var type;
  	var field;
  	var array = '';
		if ( payload.type == 'enum' ) {
			type = 'uint8_t';
		} else if ( payload.type == 'bitmap' ) {
			type = 'uint8_t';
    } else if ( payload.type == 'hex' ) {
      type = 'uint16_t';
      payload.qty = 1;
		} else {
  		type = payload.type;
  	}
  	field = payload.name;
  	if ( payload.qty != null ) {
      if ( payload.qty > 1 )
    		array = '[' + payload.qty + ']';
  	}
  	var comment = '';
  	if ( payload.conversion != null ) {
  		var conv = payload.conversion
  		comment += conv.raw_units + ', ' + conv.units + ', ' + conv.coeffs;
  	}
  	if ( payload.enum != null ) {
  		Object.keys(payload.enum).forEach(function(k) {
  			var item = payload.enum[k];
  			comment += k + ': ' + item + '; ';
  		});
  	}
  	clib += '\t' + type + ' ' + field + array + '; // ' + comment + '\n';
  });
  clib += '};\n';
});

// add stuff at bottom
clib += '\n}\n\n';
clib += '#endif';

// create output directory
fs.mkdir(dir, function(e){
  if(!e || (e && e.code === 'EEXIST')) {
    // it already exists... cool
  } else {
    console.log(e);
  }
});

// write completed file
fs.writeFileSync(dir+filename, clib+'\n');
