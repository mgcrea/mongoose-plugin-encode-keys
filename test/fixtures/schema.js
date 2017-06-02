import {Schema} from 'mongoose';
import encodeKeysPlugin from './../../src';

// const subSchema = new Schema({
//   foo: {type: String, required: false},
//   bar: {type: Object, default: {}}
// });

const subSchema = {
  foo: {type: String, required: false},
  bar: {type: Object, default: {}}
};

const schema = new Schema({
  name: {type: String, required: true},
  content: {type: Object, default: {}},
  sub: {type: subSchema, default: {}}
});

// Support exotic payload keys
schema.plugin(encodeKeysPlugin, {fields: ['content', 'sub']});

export default schema;
