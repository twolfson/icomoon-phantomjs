# icomoon-phantomjs

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

## Resources
<a href="http://thenounproject.com/noun/building-block/#icon-No5218" target="_blank">Building Block</a> designed by <a href="http://thenounproject.com/Mikhail1986" target="_blank">Michael Rowe</a> from The Noun Project

<a href="http://thenounproject.com/noun/eye/#icon-No5001" target="_blank">Eye</a> designed by <a href="http://thenounproject.com/DmitryBaranovskiy" target="_blank">Dmitry Baranovskiy</a> from The Noun Project

<a href="http://thenounproject.com/noun/moon/#icon-No2853" target="_blank">Moon</a> designed by <a href="http://thenounproject.com/somerandomdude" target="_blank">P.J. Onori</a> from The Noun Project

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
