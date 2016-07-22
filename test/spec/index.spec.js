
import expect from 'expect';
import mongoose from 'mongoose';
import {map} from 'lodash';

import testSchema from './../fixtures/schema';
import pkg from './../../package.json';

import encodeKeysPlugin from './../../src';

describe('Plugin', () => {
  const mongoUri = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/test-${pkg.name}`;
  mongoose.set('debug', true);
  const db = mongoose.createConnection(mongoUri);
  const Model = db.model('Foo', testSchema);

  before(() => Promise.all([
    Model.remove({})
  ]));
  it('constructor should export a function', () => {
    expect(encodeKeysPlugin).toBeA('function');
  });
  it('should properly save one document', done => {
    const orig = {name: 'TestSave', content: {$: 'test$', '.foo': 'test.', '\\bar': 'test\\'}};
    Model.create(orig)
      .then(doc => {
        expect(doc.content).toEqual(orig.content);
        return Model.findOne({_id: doc.id});
      })
      .then(doc => {
        expect(doc.content).toEqual(orig.content);
      })
      .then(done)
      .catch(done);
  });
  it('should properly save several documents', done => {
    const origA = {name: 'TestSaveA', content: {$: 'test$', '.foo': 'test.', '\\bar': 'test\\'}};
    const origB = {name: 'TestSaveB', content: {$: 'test$', '.foo': 'test.', '\\bar': 'test\\'}};
    Model.create([origA, origB])
      .then(docs => {
        docs.forEach(doc => {
          expect(doc.content).toEqual(origA.content);
        });
        return Model.find({_id: {$in: map(docs, 'id')}});
      })
      .then(docs => {
        docs.forEach(doc => {
          expect(doc.content).toEqual(origA.content);
        });
      })
      .then(done)
      .catch(done);
  });
  it('should properly update one document', done => {
    const orig = {name: 'TestUpdate', content: {$: 'test$', '.foo': 'test.', '\\bar': 'test\\'}};
    const udpate = {content: {$: 'test2$'}};
    Model.create(orig)
      .then(doc => {
        expect(doc.content).toEqual(orig.content);
        return Model.update({_id: doc.id}, udpate).then(() => doc);
      })
      .then(doc => Model.findOne({_id: doc.id}))
      .then(doc => {
        expect(doc.content).toEqual(udpate.content);
      })
      .then(done)
      .catch(done);
  });
  it('should properly support find without results', done => (
    Model.findOne({name: 'foo'})
      .then(done)
      .catch(done)
  ));
  it('should properly support update  results', done => (
    Model.update({name: 'foo'}, {})
      .then(() => done())
      .catch(done)
  ));
});
