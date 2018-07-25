import test from 'ava';
import React from 'react';
import {spy} from 'sinon';
import m from '.';

const runValidator = (validator, propValue) => {
	const Component = () => null;

	Component.propTypes = {
		foo: validator
	};

	React.createElement(Component, {foo: propValue});
};

const rangeInside = (t, input) => {
	runValidator(...input);
	t.false(t.context.spy.called);
};

const rangeOutside = (t, input) => {
	runValidator(...input);
	t.true(t.context.spy.called);
};

test.beforeEach(t => {
	t.context.spy = spy(console, 'error');
});

test.afterEach.always(t => {
	t.context.spy.restore();
});

test('accepts numbers as arguments', t => {
	t.notThrows((() => m(1, 2)));
	t.notThrows((() => m(-2, -1)));
	t.notThrows((() => m(-2, -1)));
	t.throws(() => m(0, 0));
	t.throws(() => m(2, 1));
	t.throws(() => m(-1, -2));
	t.throws(() => m(Infinity, -2));
	t.throws(() => m(NaN, -2));
});

test('ignore when not required', t => {
	runValidator(m(1, 2), undefined);
	t.false(t.context.spy.called);
});

test('error when required', t => {
	runValidator(m(1, 2).isRequired, undefined);
	t.true(t.context.spy.called);
});

test(rangeInside, [m(1, 2), 2]);
test(rangeInside, [m(1, 2), 1]);
test(rangeInside, [m(1, 2), 1.5]);
test(rangeInside, [m(-1, 2), 0]);
test(rangeInside, [m(0, Infinity), 5]);
test(rangeOutside, [m(1, 2), 0]);
test(rangeOutside, [m(1, 2), 0.5]);
test(rangeOutside, [m(1, 2), -1]);
test(rangeOutside, [m(-1, 0), -2]);
