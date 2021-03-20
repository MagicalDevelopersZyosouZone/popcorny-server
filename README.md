# popcorny-server
Backend server for [popcorny](https://github.com/MagicalDevelopersZyosouZone/popcorny) - A user script which allows watching web videos together.

[Documentation](./docs/README.md)

## Usage

Clone & restore npm packages
```shell
$ git clone ...
$ cd popcorny-server
$ npm install
```

Rebuild from source if you want
```shell
$ npm run build
```

Copy the `config.example.js` and rename to `config.js`, edit it for server configure.
```shell
$ cp config.example.js config.js
$ vim config.js
```

Start server
```shell
$ npm start
```