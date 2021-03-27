# popcorny-server
Backend server for [popcorny](https://github.com/MagicalDevelopersZyosouZone/popcorny) - A user script which allows watching web videos together.

[Documentation](./docs/README.md)

## Usage

### Build & run from source

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

Or build and run with docker
```shell
$ docker build -t popcorny-server .
$ docker run --name popcorny-server -d -p 5000:5000 popcorny-server
```