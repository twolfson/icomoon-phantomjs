# icomoon-phantomjs [![Build status](https://travis-ci.org/twolfson/icomoon-phantomjs.png?branch=master)](https://travis-ci.org/twolfson/icomoon-phantomjs)

# DEPRECATED
We are choosing to deprecate `fontsmith` and its family of libraries. They rely on a deprecated icomoon.io API, were never fully developed (e.g. missing SASS templates, multiple engines), and out of date (e.g. uses `grunt@0.3`).

While we would love to keep everything running, we have to choose to prioritize other projects over this one. We suggest using `grunt-webfont` as an alternative:

https://www.npmjs.com/package/grunt-webfont

If you are interested in forking, feel free to (and maybe open an issue to let me know so we can link to it).

If you have a minor request (e.g. cannot figure out how to use existing tool), feel free to open an issue describing your problem.

----------------

[IcoMoon][icomoon] driver written in PhantomJS

[icomoon]: http://icomoon.io/app/

## Getting Started
```shell
# Install module via npm
npm install -g icomoon-phantomjs

# Alternatively, you can clone the repo and run `phantomjs lib/icomoon-phantomjs.js`
# instead of `icomoon-phantomjs`

# Create a JSON file with absolute paths of SVGs to compile
echo '["/home/todd/github/twolfson.com/images/eye.svg",' > svgs.json
echo '"/home/todd/github/twolfson.com/images/fork.svg"]' >> svgs.json

# Get the URL of a zip file contaiing IcoMoon assets
icomoon-phantomjs svgs.json # Returns http://icomoon.io/FontConverter/zip/2/icomoon94905.zip
```

## Documentation
This module is intended to be a small chainable CLI utility.

```shell
icomoon-phantomjs path/to/json/containing/svg/paths
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Attribution
### Test files
<a href="http://thenounproject.com/noun/building-block/#icon-No5218" target="_blank">Building Block</a> designed by <a href="http://thenounproject.com/Mikhail1986" target="_blank">Michael Rowe</a> from The Noun Project

<a href="http://thenounproject.com/noun/eye/#icon-No5001" target="_blank">Eye</a> designed by <a href="http://thenounproject.com/DmitryBaranovskiy" target="_blank">Dmitry Baranovskiy</a> from The Noun Project

<a href="http://thenounproject.com/noun/moon/#icon-No2853" target="_blank">Moon</a> designed by <a href="http://thenounproject.com/somerandomdude" target="_blank">P.J. Onori</a> from The Noun Project

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
