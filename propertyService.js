const {Property} = require('property-listing-models');

let saveProperties = (propertiesWrapper) => {

  let len = propertiesWrapper.properties.length;
  //return new Promise((resolve, reject) => {
  //console.log('in promise saveProperties', JSON.stringify(properties, undefined, 2));
  console.log('in promise saveProperties with ' + len + ' properties');

  var numDeleted = 0;
  let numSaved = 0;

  return Property.remove(Property.where('listing_id').ne(null)).then((removedProps) => {
    console.log('removedProps', JSON.stringify(removedProps, undefined, 2));
    let obj = JSON.parse(removedProps);
    numDeleted = obj.n;
    console.log(`numDeleted ${numDeleted}`);

    return Property.create(propertiesWrapper.properties).then((savedProps) => {
      //console.log('saved all properties', JSON.stringify(savedProps, undefined, 2));
      console.log('saved all properties', savedProps.length);
      numSaved = savedProps.length;
      return {
        numDeleted,
        numSaved
      };

    });

  });
};

module.exports = {saveProperties};
