# builder-react-fullstack
[![npm version](https://badge.fury.io/js/builder-react-fullstack.svg)](https://badge.fury.io/js/builder-react-fullstack)

React/redux app archetype for [builder][builder-link].
It brings a lot of features that help you to make a production ready react/redux app.

It is used by [react-seed][react-seed-link]. 
Please check this project to understand how to use these builder tasks.

## Getting started
You could check [builder][builder-link] if you want to understand how it works.

```
npm install --save-dev builder
npm install --save builder-react-fullstack
npm install --save-dev builder-react-fullstack-dev
```

```yaml
# .builderrc
---
archetypes:
  - builder-react-fullstack
```

## Tasks
### Build
* `builder run bundle`: Bundle the app with webpack. The output is in the `./build` folder. You could run this command with these options: (eg. `builder run bundle -- --release`)
  * `--release`: Minify the bundle
  * `--devtools`: inject the global variable `__ONBUILD_REDUX_DEVTOOLS__` into the app. (useful to include **redux devtools**)
  * `--react-perf`: inject the global variable `__ONBUILD_REACT_PERF__` into the app. (useful to include **react addons perf**)
  * `--isomorphic`: inject the global variable `__ONBUILD_SERVER_RENDERING__` into the app. (useful to enable server rendering)
* `builder run build`: Clean the `./build` folder, copy assets and bundle the app.

### Server playground
* `builder run serve`: Serve the app in development mode. Check `http://localhost:3000` :smile:

### Test
* `builder run test:all`: Test the app once
* `builder run test:all:watch`: Test the app once and enter in watch mode (usefull for tdd)
* `builder run test:all:coverage`: Test the app and generate test coverage

### Linters
* `builder run eslint`: Run eslint on the project
* `builder run jscs`: Run jscs on the project
* `builder run lint`: Run the 2 previous tasks

### Release
* `builder run release -- semverCompatibleVersion`: **Only if you are using git flow**. Create a release of the app. `semverCompatipleVersion` must be valid according to [semver][semver-link]
  This will update `package.json` and create a git flow release

## Comming soon
When typescript will reach 2.0.0, I will migrate the bundle process to use typescript instead of babel.

## Builder Help

```
$ builder help builder-react-fullstack
Usage:

  builder <action> <task(s)>

Actions:

  run, concurrent, envs, help

Tasks:

  test:all
    [builder-react-fullstack] NODE_PATH=./src:$NODE_PATH mocha --opts node_modules/builder-react-fullstack/config/mocha/mocha.opts src/**/*-test.js

  test:all:coverage
    [builder-react-fullstack] NODE_PATH=./src:$NODE_PATH babel-node node_modules/.bin/istanbul cover --config node_modules/builder-react-fullstack/config/istanbul/.istanbul.yml _mocha -- --opts node_modules/builder-react-fullstack/config/mocha/mocha.opts.coverage src/**/*-test.js

  test:all:watch
    [builder-react-fullstack] NODE_PATH=./src:$NODE_PATH mocha --opts node_modules/builder-react-fullstack/config/mocha/mocha.opts.watch src/**/*-test.js

  build
    [builder-react-fullstack] node node_modules/builder-react-fullstack/lib/runner build

  bundle
    [builder-react-fullstack] node node_modules/builder-react-fullstack/lib/runner bundle

  eslint
    [builder-react-fullstack] eslint --color src/**/*.js

  jscs
    [builder-react-fullstack] jscs src/**/*.js

  lint
    [builder-react-fullstack] builder concurrent eslint jscs

  prepublish
    [builder-react-fullstack] npm run builder:compile

  release
    [builder-react-fullstack] node node_modules/builder-react-fullstack/lib/runner release

  serve
    [builder-react-fullstack] node node_modules/builder-react-fullstack/lib/runner serve
```

[builder-link]: http://builder.formidable.com/
[react-seed-link]: https://github.com/hourliert/react-seed
[semver-link]: https://github.com/npm/node-semver
