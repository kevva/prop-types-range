'use strict';
const ow = require('ow');

class PropTypeError extends Error {
	constructor(message) {
		super(message);
		this.stack = '';
	}
}

const validator = (min, max, isRequired) => {
	ow(min, ow.number.label('min').is(x => x < max || `Expected \`${x}\` to be less than \`${max}\``));
	ow(max, ow.number.label('max').is(x => x > min || `Expected \`${x}\` to be greater than \`${min}\``));

	return (props, propName, componentName) => {
		const propValue = props[propName];
		const propType = typeof propValue;
		const isNull = propValue === null;

		if (isNull || propType === 'undefined') {
			const type = isNull ? 'null' : 'undefined';

			if (isRequired) {
				return new PropTypeError(`The prop \`${propName}\` is marked as required in \`${componentName}\` but its value is \`${type}\`.`);
			}

			return null;
		}

		if (propType !== 'number') {
			return new PropTypeError(`Invalid prop \`${propName}\` of type \`${propType}\` supplied to \`${componentName}\`, expected \`number\`.`);
		}

		if (propValue < min || propValue > max) {
			return new PropTypeError(`Invalid prop \`${propName}\` of value \`${propValue}\` supplied to \`${componentName}\`, expected \`number\` between \`${min}\` and \`${max}\`.`);
		}

		return null;
	};
};

module.exports = (min, max) => {
	const fn = validator(min, max);
	fn.isRequired = validator(min, max, true);
	return fn;
};
