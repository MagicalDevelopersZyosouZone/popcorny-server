# bili-sync-server (temporary name)
Backend server for [bili-sync (temporary name)](#)

[Documentation](./docs/README.md)

## Usage

Clone & restore npm packages
```shell
$ git clone ...
$ cd bili-sync
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