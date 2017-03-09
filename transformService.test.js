const chai = require('chai');
const expect = chai.expect;
//const rewire = require('rewire');
const sinon = require('sinon');
require('sinon-as-promised');

const transformService = require('./transformService');

describe('index happy case', () => {
  it('can transform stuff', () => {

    let listings = [{listing_id: '123',
                    description: 'foobar'},
                    {listing_id: '455',
                    description: 'grrr'}];

    return transformService.transformListingsToProperties(listings).then((propertiesWrapper) => {

      expect(Array.isArray(propertiesWrapper.properties)).to.equal(true);

      let properties = propertiesWrapper.properties;

      expect(properties.length).to.equal(2);

      expect(properties[0].listing_id).to.equal('123');
    });
  });

  it('can ignore stuff', () => {

    let listings = [{listing_id: '123',
                    description: 'foobar',
                    notallowed: 'shouldnt be here'},
                    {listing_id: '455',
                    description: 'grrr'}]

    return transformService.transformListingsToProperties(listings).then((propertiesWrapper) => {

      expect(Array.isArray(propertiesWrapper.properties)).to.equal(true);

      let properties = propertiesWrapper.properties;

      expect(properties.length).to.equal(2);

      expect(properties[0].listing_id).to.equal('123');

      expect(properties[0].notallowed).to.equal(undefined);

    });

  });

});
