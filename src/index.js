import {each} from 'lodash';

export default function encodeKeysPlugin(schema, {fields = []}) {
  schema.pre('save', function preSave(next) {
    const save = this;
    encodeFields(save, next);
  });
  schema.pre('update', function preUpdate(next) {
    const update = this.getUpdate().$set;
    encodeFields(update, next);
  });
  schema.post('find', docs => {
    docs.forEach(decodeFields);
  });
  schema.post('findOne', decodeFields);
  schema.post('save', decodeFields);

  function encodeFields(doc, next) {
    if (!doc) {
      next();
      return;
    }
    fields.forEach(field => {
      if (doc[field]) {
        doc[field] = encodeKeys(doc[field]); // eslint-disable-line no-param-reassign
      }
    });
    next();
  }

  function decodeFields(doc) {
    if (!doc) {
      return;
    }
    fields.forEach(field => {
      if (doc[field]) {
        doc[field] = decodeKeys(doc[field]); // eslint-disable-line no-param-reassign
      }
    });
  }
}

export function encodeKey(key) {
  return typeof key === 'string' ? key.replace(/\\/g, '\\\\').replace(/\$/g, '\\u0024').replace(/\./g, '\\u002e') : key;
}

export function decodeKey(key) {
  return typeof key === 'string' ? key.replace(/\\u002e/g, '.').replace(/\\u0024/g, '$').replace(/\\\\/g, '\\') : key;
}

export function encodeKeys(object) {
  if (!object || typeof object !== 'object') return object;
  const res = Array.isArray(object) ? [] : {};
  each(object, (value, key) => {
    res[encodeKey(key)] = typeof object[key] === 'object' ? encodeKeys(object[key]) : object[key];
  });
  return res;
}

export function decodeKeys(object) {
  if (!object || typeof object !== 'object') return object;
  const res = Array.isArray(object) ? [] : {};
  each(object, (value, key) => {
    res[decodeKey(key)] = typeof object[key] === 'object' ? decodeKeys(object[key]) : object[key];
  });
  return res;
}
