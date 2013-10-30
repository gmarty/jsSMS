# How to contribute?

## Coding standard

There is a .jshintrc file at the project root. Your files must be checked against to make sure no
errors or warnings are present.

If your IDE doesn't support [JSHint](http://www.jshint.com/) natively, you can always install it:
```bash
$ npm install jshint -g
```

Then run:
```bash
$ jshint myfile.js
```

## Coding styles

Minimal requirements are:

* Ident with 2 spaces
* 100 characters max per line

Make sure to pass your contribution through [Google Closure Linter](https://developers.google.com/closure/utilities/docs/linter_howto):
```bash
fixjsstyle --strict myFile.js
```

## Testing

We don't have a test suite (but feel free to submit one!). So make sure to describe the problem
addressed by your pull request and how to test it.
