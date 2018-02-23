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

This project uses Prettier, so you don't have to worry about how to format the code.

If needed, you can force a reformat of all the code base using:

```bash
$ yarn format
```

## Testing

We don't have a test suite (but feel free to submit one!). So make sure to describe the problem
addressed by your pull request and how to test it.
