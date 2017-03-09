const zooplaService = require('./zooplaService');
const transformService = require('./transformService');
const propertyService = require('./propertyService');

var importZooplaData = () => {

  console.log('in importZooplaData');

  return new Promise((resolve, reject) => {
    zooplaService.getListingsFromZoopla('BR2', 'England').then((listings) => {
      console.log('in promise listing return');
      //console.log(listings);
      return transformService.transformListingsToProperties(listings);
    }).then((properties) => {
      console.log('in promise properties return upd');
      //console.log(properties);
      return propertyService.saveProperties(properties);
    }).then((numSaved) => {
      console.log('in promise saved return');
      console.log(numSaved);
      resolve(numSaved);
    }).catch((e) => {
      console.log('There was a problem');
      console.log(e);
      //reject('There was a problem');
      reject(e);
    });
  });

};

module.exports = {importZooplaData};
