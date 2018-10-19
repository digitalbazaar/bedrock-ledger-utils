/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
require('bedrock-ledger-node');
require('bedrock-mongodb');
require('bedrock-ledger-consensus-continuity');
require('veres-one-validator');
require('veres-one-consensus-continuity-elector-selection');

require('bedrock-test');
bedrock.start();
