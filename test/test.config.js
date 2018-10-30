/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));

config.jsonld.strictSSL = false;

// MongoDB
config.mongodb.name = 'bedrock_ledger_utils_test';
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

// ensure that consensus workers are disabled
config.ledger.jobs.scheduleConsensusWork.enabled = false;
