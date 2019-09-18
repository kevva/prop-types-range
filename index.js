'use strict';
const ow = require('ow');

class PropTypeError extends Error {
	constructor(message, data) {
		super(message);
		this.data = data && typeof data === 'object' ? data : {};
		this.stack = '';
	}
}

const validator = (min, max, isRequired) => {
	ow(min, 'min', ow.number.lessThan(max));
	ow(max, 'max', ow.number.greaterThan(min));

	return (props, propName, componentName) => {
		const propValue = props[propName];
		const propType = typeof propValue;
		const isNull = propValue === null;
		const expectedType = 'number';

		if (isNull || propType === 'undefined') {
			const type = isNull ? 'null' : 'undefined';

			if (isRequired) {
				return new PropTypeError(
					`The prop \`${propName}\` is marked as required in \`${componentName}\` but its value is \`${type}\`.`
				);
			}

			return null;
		}

		if (propType !== 'number') {
			return new PropTypeError(
				`Invalid prop \`${propName}\` of type \`${propType}\` supplied to \`${componentName}\`, expected \`${expectedType}\`.`,
				{expectedType}
			);
		}

		if (propValue < min || propValue > max) {
			return new PropTypeError(
				`Invalid prop \`${propName}\` of value \`${propValue}\` supplied to \`${componentName}\`, expected \`${expectedType}\` between \`${min}\` and \`${max}\`.`
			);
		}

		return null;
	};
};

module.exports = (min, max) => {
	const fn = validator(min, max);
	fn.isRequired = validator(min, max, true);
	return fn;
};
