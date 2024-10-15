// common functions, used by all three methods to combine data and display in table
function combiningData(data1, data2, data3) {
  let combinedData = [...data1.data, ...data2.data, ...data3.data];
  let result = combinedData.map((entry) => {
    const [name, surname] = entry.name.split(" ");
    return {
      name: name,
      surname: surname,
      id: entry.id,
    };
  });
  return result;
}

function displayTableData(result, displayTable) {
  let table;
  //mapping results to table rows
  const tableRows = result
    .map((entry) => {
      return `<tr><td>${entry.name}</td><td>${entry.surname}</td><td>${entry.id}</td></tr>`;
    })
    .join("");
  // tableid passed in
  table = document.getElementById(displayTable);
  //displaying within tbody of table
  table.querySelector("tbody").innerHTML = tableRows;
}

// Q1. XMLHttpRequest used synchronously
function fetchSyncXML(path) {
  const request = new XMLHttpRequest();
  // get request for specified path, false for synchronous request
  request.open("GET", path, false);
  // not sending any data
  request.send(null);
  if (request.status === 200) {
    return request.responseText;
  }
  return null;
}

function useSyncXML() {
  let data1Location, data1, data2, data3;
  // retrieving data from JSON files
  data1Location = JSON.parse(fetchSyncXML("./data/reference.json"));
  // data1 location is retrieved from reference.json stored in data1Location
  data1 = JSON.parse(fetchSyncXML("./data/" + data1Location.data_location));
  // data2 location is retrieved from data1
  data2 = JSON.parse(fetchSyncXML("./data/" + data1.data_location));
  // data3 location is known
  data3 = JSON.parse(fetchSyncXML("./data/data3.json"));

  // combining data from all three sources
  const result = combiningData(data1, data2, data3);
  displayTableData(result, "data-table1");
}

// Q2. XMLHttpRequest used asynchronously with callbacks
function fetchAsyncXML(path, callback) {
  const request = new XMLHttpRequest();
  // get request for specified path, true for asynchronous request
  request.open("GET", path, true);
  //  callback function to be executed when request is completed
  request.onload = function () {
    callback(request.responseText);
  };
  // callback function to be executed when request fails
  request.onerror = function () {
    callback(request.statusText);
  };
  // not sending any data
  request.send(null);
}

function useAsyncXML() {
  let data1Location, data1, data2, data3;
  //nested so it is completed in order, data1Location is used to fetch data1, data1 is used to fetch data2
  fetchAsyncXML("./data/reference.json", (referenceData) => {
    data1Location = JSON.parse(referenceData);

    fetchAsyncXML("./data/" + data1Location.data_location, (data1Response) => {
      data1 = JSON.parse(data1Response);

      fetchAsyncXML("./data/" + data1.data_location, (data2Response) => {
        data2 = JSON.parse(data2Response);

        fetchAsyncXML("./data/data3.json", (data3Response) => {
          data3 = JSON.parse(data3Response);

          // combined and displayed after all data fetched
          const result = combiningData(data1, data2, data3);
          displayTableData(result, "data-table2");
        });
      });
    });
  });
}

// Q3. Using fetch() and promises
async function fetchData(path) {
  try {
    //fetching data from specified path and return json
    const response = await fetch(path);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

async function useFetchData() {
  let data1Location, data1, data2, data3, combinedData;
  try {
    // using await to wait for each fetch to complete, dont need to nest
    data1Location = await fetchData("./data/reference.json");
    data1 = await fetchData("./data/" + data1Location.data_location);
    data2 = await fetchData("./data/" + data1.data_location);
    data3 = await fetchData("./data/data3.json");

    //combining and displaying
    combinedData = combiningData(data1, data2, data3);
    displayTableData(combinedData, "data-table3");
  } catch (error) {
    console.error(error);
  }
}
