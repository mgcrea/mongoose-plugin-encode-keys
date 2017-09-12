import {each, isPlainObject} from 'lodash';

export const encodeKey = key => (
  typeof key === 'string' ? key.replace(/\\/g, '\\\\').replace(/\$/g, '\\u0024').replace(/\./g, '\\u002e') : key
);

export const decodeKey = key => (
  typeof key === 'string' ? key.replace(/\\u002e/g, '.').replace(/\\u0024/g, '$').replace(/\\\\/g, '\\') : key
);

export const encodeKeys = (object) => {
  if (!object || typeof object !== 'object') return object;
  const res = Array.isArray(object) ? [] : {};
  each(object, (value, key) => {
    res[encodeKey(key)] = (isPlainObject(object[key]) || Array.isArray(object[key])) ? encodeKeys(object[key]) : object[key];
  });
  return res;
};

export const decodeKeys = (object) => {
  if (!object || typeof object !== 'object') return object;
  const res = Array.isArray(object) ? [] : {};
  each(object, (value, key) => {
    res[decodeKey(key)] = (isPlainObject(object[key]) || Array.isArray(object[key])) ? decodeKeys(object[key]) : object[key];
  });
  return res;
};
