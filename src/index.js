import {each} from 'lodash';

export default function encodeKeysPlugin(schema, {fields = []}) {
  schema.pre('save', function preSave(next) {
    const save = this;
    fields.forEach(field => {
      if (save[field]) {
        save[field] = encodeKeys(save[field]);
      }
    });
    next();
  });
  schema.pre('update', function preUpdate(next) {
    const update = this.getUpdate().$set;
    if (!update) {
      next();
      return;
    }
    fields.forEach(field => {
      if (update[field]) {
        update[field] = encodeKeys(update[field]);
      }
    });
    next();
  });
  schema.post('find', docs => {
    docs.forEach(doc => {
      fields.forEach(field => {
        doc[field] = decodeKeys(doc[field]);
      });
    });
  });
  schema.post('findOne', doc => {
    fields.forEach(field => {
      doc[field] = decodeKeys(doc[field]);
    });
  });
}

export function encodeKey(key) {
  return typeof key === 'string' ? key.replace(/\\/g, '\\\\').replace(/\$/g, '\\u0024').replace(/\./g, '\\u002e') : key;
}

export function decodeKey(key) {
  return typeof key === 'string' ? key.replace(/\\u002e/g, '.').replace(/\\u0024/g, '\$').replace(/\\\\/g, '\\') : key;
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
