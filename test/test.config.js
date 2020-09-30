/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {config} = require('bedrock');
const path = require('path');

config.mocha.tests.push(path.join(__dirname, 'mocha'));

// MongoDB
config.mongodb.name = 'bedrock_ledger_utils_test';
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

// ensure that consensus workers are disabled
config.ledger.jobs.scheduleConsensusWork.enabled = false;

// Set mode to 'test', so that DIDs are created as 'did:v1:test:...' in tests
config['veres-one-validator'].environment = 'test';

// allow self-signed certs in test framework
config['https-agent'].rejectUnauthorized = false;
