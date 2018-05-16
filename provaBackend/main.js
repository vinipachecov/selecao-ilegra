'use strict'

const fs = require('fs');
const parseData = require('./parseData');


const homedir = process.env.HOME;
const finalDir = `${homedir}/data/in`;
let arrayFiles = [];

// get the list of all files to be read and put in inside an array
fs.readdirSync(finalDir).forEach(file => {
  const filesplit = file.split('.'); 
  if (filesplit[filesplit.length - 1] === 'dat') {
    arrayFiles.push(file);
  }  
});

let buffer;
arrayFiles.forEach(filepath => {
  console.log('----------------------------------');
  console.log(filepath);
  buffer=  fs.readFileSync(finalDir +'/'+  filepath, 'utf-8');

// Parse Data
  const arrayOfLines = parseData.parseFileInLines(buffer);
  const data = parseData.parseFileData(arrayOfLines);

// get Number of Clients
  const numberOfClients = parseData.getNumberOfClients(data.clientsArray);
// get Number of Salesman
  const numberOfSalesman = parseData.getNumberOfSalesman(data.salesmanArray);

// get the most expensive sale id
  const sales = parseData.parseSales(data.salesArray);  
  const mostExpensiveSaleID = parseData.calculateMostExpensiveSale(sales);  

// get the worst salesman
  parseData.salesManSaleData(sales);
  console.log(sales);



  //final logs
  console.log('Number of clients = ', numberOfClients);
  console.log('Number of salesman = ', numberOfSalesman);
  console.log('Id of the most expensive sale = ', mostExpensiveSaleID);
});

// keep watching and do everything again if any change is done.... 
// check later
fs.watch(finalDir, { encoding: 'buffer' }, (eventType, filename) => {
  if (eventType === 'change') {    

    // Read the content of each file
    let buffer;
    arrayFiles.forEach(filepath => {
      console.log('----------------------------------');
      console.log(filepath);
      buffer=  fs.readFileSync(finalDir +'/'+  filepath, 'utf-8');      
    });    
  }  
});










