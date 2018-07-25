# prop-types-range [![Build Status](https://travis-ci.org/kevva/prop-types-range.svg?branch=master)](https://travis-ci.org/kevva/prop-types-range)

> Number range prop type validation


## Install

```
$ npm install prop-types-range
```


## Usage

```js
import React from 'react';
import propTypesRange from 'prop-types-range';

const Component = ({number}) => (
	<div>{number} is between 1 and 5</div>
);

Component.propTypes = {
	number: propTypesRange(1, 5)
};
```


## API

### propTypesRange(min, max)

#### min

Type: `number`

Minumum value of prop.

#### max

Type: `number`

Maximum value of prop.


## License

MIT © [Kevin Martensson](http://github.com/kevva)
