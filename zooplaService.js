const axios = require('axios');

var callZoopla = (postcode, country, pageSize, page) => {

  var zooplaHost = 'http://localhost:3001';
  //var zooplaHost = 'http://api.zoopla.co.uk';
  var key = 'hn2vxpm2n769t4wv4wjsqvzy';

  var zooplaUrl = `${zooplaHost}/api/v1/property_listings.js?api_key=${key}&country=${country}&postcode=${postcode}&page_number=${page}&page_size=${pageSize}`;

  console.log(`zoopla url is ${zooplaUrl}`);

  return axios.get(zooplaUrl);

  // return axios.get(zooplaUrl).then((response) => {
  //   return response.listing;
  // }).catch((e) => {
  //
  // });

};

var getListingsFromZoopla = (postcode, country) => {

  var pageSize = 100;
  var startingPage = 1;
  var numPagesToCall = 1;

  var listings = [];

  // initial call
  return callZoopla(postcode, country, pageSize, startingPage).then((response) => {
    console.log('zoopla response');
    //console.log(response);
    var totalNumListings = response.data.result_count;
    var divTNL = totalNumListings / pageSize;
    numPagesToCall = Math.ceil(divTNL);
    console.log(`totalNumListings ${totalNumListings} divTNL ${divTNL} numPagesToCall ${numPagesToCall}`);

    if (totalNumListings > 0) {
      console.log('listings > 0');
      listings.push(...response.data.listing);
    }

    if (numPagesToCall > 1) {
      console.log('numPagesToCall > 1');
      var promises = [];

      for (var i = 2; i <= numPagesToCall; i++) {
        console.log(`i ${i} numPagesToCall ${numPagesToCall}`);
        promises.push(callZoopla(postcode, country, pageSize, i).then((response) => {
          listings.push(...response.data.listing);
        }));
      }

      return Promise.all(promises).then(() => {
        console.log('returning listings in promise all - there are ' + listings.length + ' listings');
        return listings;
      });
    }
    console.log('returning listings no promise all');
    return listings;
  });

};

module.exports.getListingsFromZoopla = getListingsFromZoopla;
