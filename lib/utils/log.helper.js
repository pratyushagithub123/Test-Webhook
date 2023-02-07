const chalk = require('chalk');
const consoleLog = console.log;
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});

const error = chalk.bold.red;
const info = chalk.blue.bold;
const warning = chalk.keyword('orange');
const success = chalk.keyword('green').bold;
const result = chalk.hex('#DEADED');
const objerror = chalk.keyword('red');

function log(logtype,message) {

  if(logtype == "info"){
    if(process.env.NODE_ENV ==='development')
      consoleLog(info(message))
  }else if(logtype == "error"){
     consoleLog(error(message))
  } else if(logtype == "warning"){
     consoleLog(warning(message))
  } else if(logtype == "success"){
     consoleLog(success(message))
  } else if(logtype === 'object' || logtype ==='array'){
     consoleLog(result(JSON.stringify(message)));
  } else if(logtype === 'objecterror'){
     consoleLog(objerror(JSON.stringify(message)));
  }

}


module.exports = { log };
