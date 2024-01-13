import { unmarshalPrivateKey } from '@libp2p/crypto/keys';
import { logger } from '@libp2p/logger';
import errCode from 'err-code';
import { Key } from 'interface-datastore/key';
import { base32upper } from 'multiformats/bases/base32';
import * as Digest from 'multiformats/hashes/digest';
import { identity } from 'multiformats/hashes/identity';
import NanoDate from 'timestamp-nano';
import { equals as uint8ArrayEquals } from 'uint8arrays/equals';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import * as ERRORS from './errors.js';
import { IpnsEntry } from './pb/ipns.js';
import { createCborData, ipnsRecordDataForV1Sig, ipnsRecordDataForV2Sig, normalizeValue } from './utils.js';
const log = logger('ipns');
const ID_MULTIHASH_CODE = identity.code;
const DEFAULT_TTL = BigInt(3.6e+12); // 1 Hour or 3600 Seconds
export const namespace = '/ipns/';
export const namespaceLength = namespace.length;
const defaultCreateOptions = {
    v1Compatible: true,
    lifetimeNs: DEFAULT_TTL
};
export async function create(peerId, value, seq, lifetime, options = defaultCreateOptions) {
    // Validity in ISOString with nanoseconds precision and validity type EOL
    const expirationDate = new NanoDate(Date.now() + Number(lifetime));
    const validityType = IpnsEntry.ValidityType.EOL;
    const lifetimeNs = typeof options.lifetimeNs === "bigint" ? options.lifetimeNs : DEFAULT_TTL;
    return _create(peerId, value, seq, validityType, expirationDate, lifetimeNs, options);
}
export async function createWithExpiration(peerId, value, seq, expiration, options = defaultCreateOptions) {
    const expirationDate = NanoDate.fromString(expiration);
    const validityType = IpnsEntry.ValidityType.EOL;
    const lifetimeNs = typeof options.lifetimeNs === "bigint" ? options.lifetimeNs : DEFAULT_TTL;
    return _create(peerId, value, seq, validityType, expirationDate, lifetimeNs, options);
}
const _create = async (peerId, value, seq, validityType, expirationDate, ttl, options = defaultCreateOptions) => {
    seq = BigInt(seq);
    const isoValidity = uint8ArrayFromString(expirationDate.toString());
    const normalizedValue = normalizeValue(value);
    const encodedValue = uint8ArrayFromString(normalizedValue);
    if (peerId.privateKey == null) {
        throw errCode(new Error('Missing private key'), ERRORS.ERR_MISSING_PRIVATE_KEY);
    }
    const privateKey = await unmarshalPrivateKey(peerId.privateKey);
    const data = createCborData(encodedValue, isoValidity, validityType, seq, ttl);
    const sigData = ipnsRecordDataForV2Sig(data);
    const signatureV2 = await privateKey.sign(sigData);
    let pubKey;
    // if we cannot derive the public key from the PeerId (e.g. RSA PeerIDs),
    // we have to embed it in the IPNS record
    if (peerId.publicKey != null) {
        const digest = Digest.decode(peerId.toBytes());
        if (digest.code !== ID_MULTIHASH_CODE || !uint8ArrayEquals(peerId.publicKey, digest.digest)) {
            pubKey = peerId.publicKey;
        }
    }
    if (options.v1Compatible === true) {
        const signatureV1 = await signLegacyV1(privateKey, encodedValue, validityType, isoValidity);
        const record = {
            value: normalizedValue,
            signatureV1,
            validity: expirationDate,
            validityType,
            sequence: seq,
            ttl,
            signatureV2,
            data
        };
        if (pubKey != null) {
            record.pubKey = pubKey;
        }
        return record;
    }
    else {
        const record = {
            value: normalizedValue,
            validity: expirationDate,
            validityType,
            sequence: seq,
            ttl,
            signatureV2,
            data
        };
        if (pubKey != null) {
            record.pubKey = pubKey;
        }
        return record;
    }
};
/**
 * rawStdEncoding with RFC4648
 */
const rawStdEncoding = (key) => base32upper.encode(key).slice(1);
/**
 * Get key for storing the record locally.
 * Format: /ipns/${base32(<HASH>)}
 *
 * @param {Uint8Array} key - peer identifier object.
 */
export const getLocalKey = (key) => new Key(`/ipns/${rawStdEncoding(key)}`);
export { unmarshal } from './utils.js';
export { marshal } from './utils.js';
export { peerIdToRoutingKey } from './utils.js';
export { peerIdFromRoutingKey } from './utils.js';
export { extractPublicKey } from './utils.js';
/**
 * Sign ipns record data using the legacy V1 signature scheme
 */
const signLegacyV1 = async (privateKey, value, validityType, validity) => {
    try {
        const dataForSignature = ipnsRecordDataForV1Sig(value, validityType, validity);
        return await privateKey.sign(dataForSignature);
    }
    catch (error) {
        log.error('record signature creation failed', error);
        throw errCode(new Error('record signature creation failed'), ERRORS.ERR_SIGNATURE_CREATION);
    }
};
//# sourceMappingURL=index.js.map