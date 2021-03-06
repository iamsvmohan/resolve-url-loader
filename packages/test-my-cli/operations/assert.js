'use strict';

const {basename} = require('path');
const compose = require('compose-function');

const joi = require('../lib/joi');
const {assertInLayer} = require('../lib/assert');
const {lens, doFirst, sequence} = require('../lib/promise');
const {operation, assertInOperation} = require('../lib/operation');
const {assertExec} = require('../lib/assert');

const NAME = basename(__filename).slice(0, -3);

exports.schema = {
  debug: joi.debug().optional()
};

/**
 * A lens into the test and the result of the last exec() as consecutive arguments.
 *
 * @type {function(...Function):function(object):Promise} A sequence monad
 */
exports.create = compose(
  operation(NAME),
  compose(doFirst, lens('*', null), sequence)(
    assertInOperation(`misuse: ${NAME}() somehow escaped the operation`),
    lens('layer', null)(assertInLayer(`${NAME}() must be used within layer()`)),
    lens('exec', null)(assertExec(`${NAME}() needs a preceding exec()`))
  ),
  lens(['test', 'exec'], null),
  sequence
);
