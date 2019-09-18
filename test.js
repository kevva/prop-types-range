import test from 'ava';
import React from 'react';
import safeEval from 'safe-eval';
import {spy} from 'sinon';
import propTypesRange from '.';

const runValidator = (validator, propValue) => {
	const Component = () => null;

	Component.propTypes = {
		foo: validator
	};

	React.createElement(Component, {foo: propValue});
};

const rangeInsideMacro = (t, [validator, propValue]) => {
	runValidator(safeEval(validator, {propTypesRange}), propValue);
	t.false(t.context.spy.called);
};

const rangeOutsideMacro = (t, [validator, propValue]) => {
	runValidator(safeEval(validator, {propTypesRange}), propValue);
	t.true(t.context.spy.called);
};

rangeInsideMacro.title = (_, [validator, propValue]) => `${propValue} is inside ${validator}`;
rangeOutsideMacro.title = (_, [validator, propValue]) => `${propValue} is outside ${validator}`;

test.beforeEach(t => {
	t.context.spy = spy(console, 'error');
});

test.afterEach.always(t => {
	t.context.spy.restore();
});

test('accepts numbers as arguments', t => {
	t.notThrows((() => propTypesRange(1, 2)));
	t.notThrows((() => propTypesRange(-2, -1)));
	t.notThrows((() => propTypesRange(-2, -1)));
	t.throws(() => propTypesRange(0, 0), 'Expected number `min` to be less than 0, got 0');
	t.throws(() => propTypesRange(2, 1), 'Expected number `min` to be less than 1, got 2');
	t.throws(() => propTypesRange(-1, -2), 'Expected number `min` to be less than -2, got -1');
	t.throws(() => propTypesRange(Infinity, -2), 'Expected number `min` to be less than -2, got Infinity');
	t.throws(() => propTypesRange(NaN, -2), 'Expected number `min` to be less than -2, got NaN');
	t.throws(() => propTypesRange('1', -2), 'Expected `min` to be of type `number` but received type `string`');
});

test('ignore when not required', t => {
	runValidator(propTypesRange(1, 2), undefined);
	t.false(t.context.spy.called);
});

test('error when required', t => {
	runValidator(propTypesRange(1, 2).isRequired, undefined);
	t.true(t.context.spy.called);
});

test(rangeInsideMacro, ['propTypesRange(1, 2)', 2]);
test(rangeInsideMacro, ['propTypesRange(1, 2)', 1]);
test(rangeInsideMacro, ['propTypesRange(1, 2)', 1.5]);
test(rangeInsideMacro, ['propTypesRange(-1, 2)', 0]);
test(rangeInsideMacro, ['propTypesRange(0, Infinity)', 5]);
test(rangeOutsideMacro, ['propTypesRange(1, 2)', 0]);
test(rangeOutsideMacro, ['propTypesRange(1, 2)', 0.5]);
test(rangeOutsideMacro, ['propTypesRange(1, 2)', -1]);
test(rangeOutsideMacro, ['propTypesRange(-1, 0)', -2]);
