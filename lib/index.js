/*!
 * Copyright (c) 2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _ = require('lodash');
const bedrock = require('bedrock');
const {BedrockError} = bedrock.util;

const api = {};
module.exports = api;

// FIXME: should this entire operation fail (as it does now) if there is an
// issue with any subset of the electors?
api._getElectorPoolElectors = async ({ledgerConfiguration, ledgerNode}) => {
  const {electorPool: electorPoolDocId} =
    ledgerConfiguration.electorSelectionMethod;
  if(!electorPoolDocId) {
    return {};
  }
  // get the electorPool document
  // FIXME: include maxBlockHeight? I believe the latest document is always
  // desired/required
  let electorPoolDocument;
  try {
    electorPoolDocument = await ledgerNode.records.get(
      {recordId: electorPoolDocId});
  } catch(e) {
    if(e.name === 'NotFoundError') {
      // the electorPool document has not been defined yet.
      return [];
    }
    throw e;
  }
  const {record: {electorPool}} = electorPoolDocument;
  if(!electorPool) {
    // veres-one-validator must ensure that this does not occur
    throw new BedrockError(
      'Elector pool document does not contain `electorPool`',
      'InvalidStateError', {electorPoolDocument});
  }
  const electors = {};

  // FIXME: is type an array or a string?  Value is TBD
  const continuityServiceType = 'Continuity2017Peer';

  for(const e of electorPool) {
    // service may be a string referencing a serviceId contained in a DID
    // Document referenced in `e.elector`
    if(typeof e.service === 'string') {
      // dereference elector's DID document to locate the service descriptor
      // `records.get` throws NotFoundError on an unknown recordId
      const {record} = await ledgerNode.records.get({recordId: e.elector});
      const {service: electorService} = record;
      if(!electorService) {
        throw new BedrockError('Elector\'s DID document does not contain a '
          + 'service descriptor.', 'NotFoundError', {elector: record});
      }
      const service = _.find(electorService, {
        id: e.service, type: continuityServiceType
      });
      if(!service) {
        // TODO: fixup error
        throw new Error('Elector\'s DID document does not contain a '
          + 'service descriptor.', 'NotFoundError', {elector: record});
      }
      electors[e.elector] = {id: service.serviceEndpoint};
    }

    // service may be an embedded service descriptor
    if(typeof e.service === 'object') {
      if(e.service.type === continuityServiceType &&
        e.service.serviceEndpoint) {
        electors[e.elector] = {id: e.service.serviceEndpoint};
      } else {
        // veres-one-validator must ensure that this never occurs
        throw new BedrockError(
          'Invalid service descriptor.', 'InvalidStateError', {elector: e});
      }
    }
  }
  // the current return map allows for correlation of elector DIDs to their
  // service endpoints
  return electors;
};
