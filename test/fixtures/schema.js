import {Schema} from 'mongoose';
import encodeKeysPlugin from './../../src';

const schema = new Schema({
  name: {type: String, required: true},
  content: {type: Object, default: {}}
});

// Support exotic payload keys
schema.plugin(encodeKeysPlugin, {fields: ['content']});

export default schema;
