import {includes, startsWith} from 'lodash';
import {encodeKeys, decodeKeys, encodeKey, decodeKey} from './helpers';

export default function encodeKeysPlugin(schema, {fields = []} = {}) {
  // Helpers
  const isEncodedKey = key => fields.some(field => key === field || startsWith(key, `${field}.`));
  const encodeFields = (doc) => {
    if (!doc) {
      return;
    }
    fields.forEach((field) => {
      if (doc[field]) {
        doc[field] = encodeKeys(doc[field]); // eslint-disable-line no-param-reassign
      }
    });
  };
  const encodeUpdateFields = (obj, excluded = []) => {
    if (!obj) {
      return;
    }
    Object.keys(obj).forEach((key) => {
      if (!includes(excluded, key) && isEncodedKey(key)) {
        obj[key] = encodeKeys(obj[key]); // eslint-disable-line no-param-reassign
      }
    });
  };
  const decodeFields = (doc) => {
    if (!doc) {
      return;
    }
    fields.forEach((field) => {
      if (doc[field]) {
        doc[field] = decodeKeys(doc[field]); // eslint-disable-line no-param-reassign
      }
    });
  };


  // Encoding
  function preSave(next) {
    const save = this;
    encodeFields(save);
    next();
  }
  schema.pre('save', preSave);

  function preUpdate(next) {
    const update = this.getUpdate();
    const usedOperators = [];
    Object.keys(update).forEach((fieldOrOperator) => {
      const isOperator = startsWith(fieldOrOperator, '$');
      if (isOperator) {
        // Encode all operators sub-objects
        encodeUpdateFields(update[fieldOrOperator]);
        usedOperators.push(fieldOrOperator);
      }
    });
    // Encode remaining fields
    encodeUpdateFields(update, usedOperators);
    next();
  }
  schema.pre('update', preUpdate);
  schema.pre('findOneAndUpdate', preUpdate);

  // Decoding
  schema.post('find', (docs) => {
    docs.forEach(decodeFields);
  });
  schema.post('findOne', decodeFields);
  schema.post('save', decodeFields);
}

export {encodeKeys, decodeKeys, encodeKey, decodeKey};
