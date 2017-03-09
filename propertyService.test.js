const chai = require('chai');
const expect = chai.expect;
//const rewire = require('rewire');
const sinon = require('sinon');
require('sinon-as-promised');

const {Property} = require('property-listing-models');

const propertyService = require('./propertyService');

describe('saves properties', () => {

  var sandbox;

  var removeStub;
  var createStub;

  beforeEach(() => {
    console.log('beforeeach');

    sandbox = sinon.sandbox.create();
    removeStub = sandbox.stub(Property, 'remove');
    // crazily it returns a string
    removeStub.resolves('{"n":4,"ok":1}');

    createStub = sandbox.stub(Property, 'create');
    createStub.resolves([{description: 'foo'}]);

  });

  afterEach(() => {
    sandbox.restore();
  });

  it('can save properties', () => {

    // let dburl = process.env.MONGODB_URI;
    // console.log('dburl', dburl);

    let propertiesWrapper = {properties: [{listing_id: '123',
                    description: 'foobar'},
                    {listing_id: '455',
                    description: 'grrr'}]};

    return propertyService.saveProperties(propertiesWrapper).then((resultObj) => {

      expect(removeStub).to.have.been.called;
      //expect(removeStub.firstCall.args[0]).to.equal(propertiesWrapper);
      expect(createStub).to.have.been.called;
      expect(createStub.firstCall.args[0]).to.equal(propertiesWrapper.properties);

      expect(resultObj).to.not.be.undefined;
      expect(resultObj.numDeleted).to.equal(4);
      expect(resultObj.numSaved).to.equal(1);
    });
  });

});
