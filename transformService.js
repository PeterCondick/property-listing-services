const _ = require('lodash');

var transformListingToProperty = (listing) => {

  var property = _.pick(listing, ['listing_id',
                              'property_report_url',
                              'description',
                              'first_published_date',
                              'num_floors',
                              'num_bedrooms',
                              'num_bathrooms',
                              'listing_status',
                              'status',
                              'property_type',
                              'price',
                              'latitude',
                              'longitude',
                              'displayable_address',
                              'outcode',
                              'country',
                              'image_url',
                              'thumbnail_url']);

  return property;
};

var transformListingsToProperties = (listings) => {

  return new Promise((resolve, reject) => {
    //console.log('in promise transformListingsToProperties', listings);
    console.log('in promise transformListingsToProperties there are ' + listings.length + ' listings');

    var properties = [];

    properties = listings.map(transformListingToProperty);

    resolve({properties});
  });
};

module.exports = {transformListingsToProperties};
