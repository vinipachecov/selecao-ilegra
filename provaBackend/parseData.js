

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
    if (data !== undefined && data !== '') {
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


lib.compareTotalSalesMan = function compareTotalSalesMan(a,b) {  
  if (a.totalSales < b.totalSales) {    
    return -1;
  } 
  if (a.totalSales > b.totalSales) {    
    return 1;
  }  
return 0;
}
lib.calculateMostExpensiveSale = function(salesArray) { 
  const res = salesArray.sort(lib.compareTotal);  
  return res[0];
}

lib.worstSalesManInFile = function(salesArray, salesManArray) {
  let total = 0;
  for (let index = 0; index < salesManArray.length; index++) {
    total = 0;    

    salesArray.forEach(sale => {
      if (sale.salesManName === salesManArray[index].name) {
        total += sale.total;
      }      
    });
    
    salesManArray[index] = { ...salesManArray[index], totalSales: total };
  }
  
  return salesManArray.sort(lib.compareTotalSalesMan)[0];  
}

//* AUXILIARY METHOD
lib.printSaleItems = function(Sale) {
  Sale.itemArray.forEach(item => {
    console.log(item);
  })
}

lib.organizeWrintingData = function(clientList, salesManList, mostExpensiveSaleId, worstSalesMan) {
  let final = [];
  let res = '';  

  // organize client data   
  clientList.forEach(clientData => {
    final.push(`Amount of clients in the input file ${clientData.filepath} =  ${clientData.numberOfClients}\n`);    
  });
  // insert a separator
  final.push('------------------------\n');

  //organize salesman data
  salesManList.forEach(salesManData => {
    final.push(`Amount of salesman in the input file ${salesManData.filepath} =  ${salesManData.numberOfSalesman}\n`);    
  });
  final.push('------------------------\n');

  // most expensive id and worstSalesMan ever

  final.push(`ID of the most expensive sale is ${mostExpensiveSaleId}\n`);
  final.push(`Worst salesman ever is ${worstSalesMan}`);

  // compact everything inside a single string
  final.forEach(line => {
    res += line;
  });

  return res;  
}

module.exports = lib;