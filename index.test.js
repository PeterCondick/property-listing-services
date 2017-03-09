process.env.MONGODB_URI = 'mongodb://localhost:27017/PropertyAppTest';

// const expect = require('expect');
const chai = require('chai');
const expect = chai.expect;
//const rewire = require('rewire');
const sinon = require('sinon');
require('sinon-as-promised');
chai.use(require('sinon-chai'));

const zooplaService = require('./zooplaService');
const transformService = require('./transformService');
const propertyService = require('./propertyService');

var index = require('./index');


describe('index happy case', () => {


  // var zooplaServiceMock = {
  //   getListingsFromZoopla: function (postcode, country) {
  //     console.log('mock called');
  //   }
  // };
  // var transformService = {
  //   transformListingsToProperties: expect.createSpy()
  // };
  // var propertyService = {
  //   saveProperties: expect.createSpy()
  // };

  var sandbox;

  var getListingsFromZooplaStub;
  var transformListingsToPropertiesStub;
  var savePropertiesStub;


  beforeEach(() => {
    console.log('beforeeach');
    // index.__set__('zooplaService', zooplaServiceMock);
    // index.__set__('transformService', transformService);
    // index.__set__('propertyService', propertyService);

    sandbox = sinon.sandbox.create();
    getListingsFromZooplaStub = sandbox.stub(zooplaService, 'getListingsFromZoopla');
    getListingsFromZooplaStub.resolves([{description: 'foo'}]);

    transformListingsToPropertiesStub = sandbox.stub(transformService, 'transformListingsToProperties');
    transformListingsToPropertiesStub.resolves([{description: 'foo'}]);

    savePropertiesStub = sandbox.stub(propertyService, 'saveProperties');
    savePropertiesStub.resolves({numSaved: 5});

  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call the three services', () => {

    //console.log('zooplaService is ' + index.__get__('zooplaService'));

    return index.importZooplaData().then(() => {
      //expect(zooplaServiceMock.getListingsFromZoopla).toHaveBeenCalledWith('BR2', 'England');
      // expect(getListingsFromZooplaStub).toHaveBeenCalledWith('BR2', 'England');
      expect(getListingsFromZooplaStub).to.have.been.called;
      expect(getListingsFromZooplaStub.firstCall.args[0]).to.equal('BR2');
      expect(getListingsFromZooplaStub.firstCall.args[1]).to.equal('England');

      expect(transformListingsToPropertiesStub).to.have.been.called;
      expect(transformListingsToPropertiesStub.firstCall.args[0]).to.eql([{description: 'foo'}]);

      expect(savePropertiesStub).to.have.been.called;
      expect(savePropertiesStub.firstCall.args[0]).to.eql([{description: 'foo'}]);
      //done();
    // }).catch((e) => {
    //   done(e);
    });
  });
});

describe('index transform unhappy case', () => {

  var sandbox;

  var getListingsFromZooplaStub;
  var transformListingsToPropertiesStub;
  var savePropertiesStub;


  beforeEach(() => {
    console.log('beforeeach');

    sandbox = sinon.sandbox.create();
    getListingsFromZooplaStub = sandbox.stub(zooplaService, 'getListingsFromZoopla');
    getListingsFromZooplaStub.resolves([{description: 'foo'}]);

    transformListingsToPropertiesStub = sandbox.stub(transformService, 'transformListingsToProperties');
    transformListingsToPropertiesStub.rejects(new Error('err its all gone wrong'));

    savePropertiesStub = sandbox.stub(propertyService, 'saveProperties');
    savePropertiesStub.resolves({numSaved: 5});

  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should only call 2 services', (done) => {

    //console.log('zooplaService is ' + index.__get__('zooplaService'));

    index.importZooplaData().then(() => {

      console.log('got here oh no');

      done(new Error('shouldnt be here'));
    }).catch((e) => {

      expect(getListingsFromZooplaStub).to.have.been.called;
      expect(getListingsFromZooplaStub.firstCall.args[0]).to.equal('BR2');
      expect(getListingsFromZooplaStub.firstCall.args[1]).to.equal('England');

      expect(savePropertiesStub).to.not.have.been.called;

      expect(transformListingsToPropertiesStub).to.have.been.called;
      expect(transformListingsToPropertiesStub.firstCall.args[0]).to.eql([{description: 'foo'}]);

      console.log('in the catch block');
      expect(e).to.eql(new Error('err its all gone wrong'));
      done();
    });
  });
});
