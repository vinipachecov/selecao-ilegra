const fs = require('fs');
const parseData = require('./parseData');
const writeData = require('./writeData');

const lib = {};

const homedir = process.env.HOME;
const finalDir = `${homedir}/data/in`;
let arrayFiles = [];

lib.mainLoop = function() {
  arrayFiles = [];
  // get the list of all files to be read and put in inside an array
  fs.readdirSync(finalDir).forEach(file => {
    const filesplit = file.split('.'); 
    if (filesplit[filesplit.length - 1] === 'dat') {
      arrayFiles.push(file);
    }  
  });

  let buffer;
  let clientNumberPerFileList = [];
  let salesmanNumberPerFileList = [];
  let arrayOfMostExpensiveSales = [];
  let worstSalesManList = [];
  arrayFiles.forEach(filepath => {  
    // console.log('----------------------------------');
    // console.log(filepath);
    buffer=  fs.readFileSync(finalDir +'/'+  filepath, 'utf-8');

  // Parse Data
    const arrayOfLines = parseData.parseFileInLines(buffer);
    const data = parseData.parseFileData(arrayOfLines);

    // check if data is not null in any of the arrays

  // get Number of Clients
    const numberOfClients = parseData.getNumberOfClients(data.clientsArray);
  // get Number of Salesman
    const numberOfSalesman = parseData.getNumberOfSalesman(data.salesmanArray);

  // get the most expensive sale id in the file
    const sales = parseData.parseSales(data.salesArray);      
    arrayOfMostExpensiveSales.push(parseData.calculateMostExpensiveSale(sales));  

  // get the worst salesman
    worstSalesManList.push(parseData.worstSalesManInFile(sales, data.salesmanArray));  
    
    // gather results
    clientNumberPerFileList.push({filepath, numberOfClients});
    salesmanNumberPerFileList.push({filepath, numberOfSalesman});
  });


  if (worstSalesManList !== undefined) {
    worstSalesManList.sort(parseData.compareTotalSalesMan);

    // console.log('Worst salesman is = ', worstSalesManList[0]);  
  }

  // Find the most expensive sales between all files
  if (arrayOfMostExpensiveSales !== undefined) {
    arrayOfMostExpensiveSales.sort(parseData.compareTotal);
    
  }

  const dataToWrite = parseData.organizeWrintingData(
    clientNumberPerFileList,
    salesmanNumberPerFileList,
    arrayOfMostExpensiveSales[0].id,
    worstSalesManList[0].name
  );

  writeData.createFile( homedir + '/data/out/'+ 'res.done.dat', dataToWrite);
}



module.exports = lib;
