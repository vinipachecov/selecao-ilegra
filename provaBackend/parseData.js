

const lineReader = require('readline');

const lib = {};


lib.parseFileInLines = function(fileBuffer) {
  return fileBuffer.split('\n');
}

lib.parseFileData = function(linesArray) {
  let data;
  let dataArray = [];
  let clientsArray = [];
  let salesmanArray = [];
  let salesArray = [];
  linesArray.forEach(line => {
    dataArray.push(lib.parseLine(line));    
  });

  dataArray.forEach(data => {
    switch (data.id) {
      case '001':
        salesmanArray.push(data);
        break;
      case '002':
        clientsArray.push(data);
        break;
      case '003':
        salesArray.push(data);
        break;
    }
  });

  data = {
    salesmanArray,
    clientsArray,
    salesArray
  };
  
  return data;
}

lib.parseLine = function(line) {    
  let data;
  const temp = line.split('ç');  
  switch(temp[0]){
    case '001':
      data = {
        id: temp[0],
        cpf: temp[1],
        name: temp[2],
        salary: temp[3]
      }
      break;
    case '002':
      data = {
        id: temp[0],
        cnpj: temp[1],
        name: temp[2],
        businessArea: temp[3]
      }
      break;
    case '003':
      data = {
        id: temp[0],
        saleid: temp[1],
        itemArray: temp[2],
        salesManName: temp[3]
      }
      break;
  }
  return data;
}

lib.getNumberOfClients = function(clientsArray) {    
  return clientsArray.length;  
};

lib.getNumberOfSalesman = function(salesManArray) {   
  return salesManArray.length;  
}

lib.parseSales = function(dataArray) {
  let saleDataArray = [];
  let saleItems;  
  dataArray.forEach(data => {        
    const res = data.itemArray.match( /\[([^\]]+)]/);
    saleItems = res[1];
    // split the saleItem
    const saleItemsArray = saleItems.split(',');

    // get the item data
    let saleItemList = [];    
    saleItemsArray.forEach(itemData => {
      const itemDataSplit = itemData.split('-');
      saleItemList.push(
        {
          itemID: itemDataSplit[0],
          quantity: itemDataSplit[1],
          price: itemDataSplit[2] 
        }
      );     
    });

    // Sale array data
    saleDataArray.push({
      id: data.saleid,
      itemArray: saleItemList,
      salesManName: data.salesManName
    });
  });

  // calculate total of each sale
  for (let i = 0; i < saleDataArray.length; i++) {
    saleDataArray[i] = lib.calculateSaleTotal(saleDataArray[i]);    
  } 

  return saleDataArray;
}

lib.calculateSaleTotal = function(sale) {
  let total = 0; 
  sale.itemArray.forEach(item => {
    const itemTotal = parseFloat(item.quantity) * parseFloat(item.price);
    total += itemTotal;  
  });
  return { ...sale, total };
}

// descending order
lib.compareTotal = function compareTotal(a,b) {  
  if (a.total > b.total) {    
    return -1;
  } 
  if (a.total < b.total) {    
    return 1;
  }  
return 0;
}

lib.calculateMostExpensiveSale = function(salesArray) { 
  const res = salesArray.sort(lib.compareTotal);  
  return res[0].id;
}

//* AUXILIARY METHOD
lib.printSaleItems = function(Sale) {
  Sale.itemArray.forEach(item => {
    console.log(item);
  })
}

lib.salesManSaleData = function(salesArray) {
  
}

module.exports = lib;