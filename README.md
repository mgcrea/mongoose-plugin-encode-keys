# mongoose-plugin-encode-keys

[![npm version](https://img.shields.io/npm/v/mongoose-plugin-encode-keys.svg)](https://www.npmjs.com/package/mongoose-plugin-encode-keys)
[![license](https://img.shields.io/github/license/mgcrea/mongoose-plugin-encode-keys.svg?style=flat)](https://tldrlegal.com/license/mit-license)
[![build status](http://img.shields.io/travis/mgcrea/mongoose-plugin-encode-keys/master.svg?style=flat)](http://travis-ci.org/mgcrea/mongoose-plugin-encode-keys)
[![dependencies status](https://img.shields.io/david/mgcrea/mongoose-plugin-encode-keys.svg?style=flat)](https://david-dm.org/mgcrea/mongoose-plugin-encode-keys)
[![devDependencies status](https://img.shields.io/david/dev/mgcrea/mongoose-plugin-encode-keys.svg?style=flat)](https://david-dm.org/mgcrea/mongoose-plugin-encode-keys#info=devDependencies)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36d1ac9977104416b71a0346be48230f)](https://www.codacy.com/app/olivier_5/mongoose-plugin-encode-keys?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mgcrea/mongoose-plugin-encode-keys&amp;utm_campaign=Badge_Grade)
[![npm downloads](https://img.shields.io/npm/dm/mongoose-plugin-encode-keys.svg)](https://www.npmjs.com/package/mongoose-plugin-encode-keys)

Add support for unsafe chars inside MongoDB field names (like `.` or keys starting with `$`)

## Quickstart

- Load the plugin inside your schema

```js
import {Schema} from 'mongoose';
import encodeKeysPlugin from 'mongoose-plugin-encode-keys';

const schema = new Schema({
  name: {type: String, required: true},
  content: {type: Object, default: {}}
});

// Support exotic payload keys
schema.plugin(encodeKeysPlugin, {fields: ['content']});

export default schema;
```

## Testing

- You can quickly start hacking around

```bash
git clone -o github git@github.com:mgcrea/mongoose-plugin-encode-keys.git
cd mongoose-plugin-encode-keys
npm i
npm test
```
