const chai = require('chai');
const expect = chai.expect;
//const rewire = require('rewire');
const sinon = require('sinon');
require('sinon-as-promised');
chai.use(require('sinon-chai'));

const axios = require('axios');

const zooplaService = require('./zooplaService');

describe('it can call zoopla', () => {
  var sandbox;

  var getStub;

  beforeEach(() => {
    console.log('beforeeach');

    sandbox = sinon.sandbox.create();
    getStub = sandbox.stub(axios, 'get');
    getStub.resolves({data: {  country: 'England',  result_count: 1,  longitude: 0.0269195,  area_name: 'BR2',  listing: [    {listing_id: '1234'}]}});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should do some stuff', () => {
    return zooplaService.getListingsFromZoopla('BR2', 'England').then((listings) => {
      expect(getStub).to.have.been.calledOnce;
      //expect(getStub).not.to.have.been.called;
      //getStub.should.have.been.calledOnce;

      //sinon.assertCalledWith(getStub, 'sds');
      expect(Array.isArray(listings)).to.equal(true);
      expect(listings[0].listing_id).to.equal('1234');

    });
  });
});
