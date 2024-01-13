import { Key } from 'interface-datastore/key';
import NanoDate from 'timestamp-nano';
import { IpnsEntry } from './pb/ipns.js';
import type { PeerId } from '@libp2p/interface';
import type { CID } from 'multiformats/cid';
export declare const namespace = "/ipns/";
export declare const namespaceLength: number;
export interface IPNSRecordV1V2 {
    /**
     * value of the record
     */
    value: string;
    /**
     * signature of the record
     */
    signatureV1: Uint8Array;
    /**
     * Type of validation being used
     */
    validityType: IpnsEntry.ValidityType;
    /**
     * expiration datetime for the record in RFC3339 format
     */
    validity: NanoDate;
    /**
     * number representing the version of the record
     */
    sequence: bigint;
    /**
     * ttl in nanoseconds
     */
    ttl?: bigint;
    /**
     * the public portion of the key that signed this record (only present if it was not embedded in the IPNS key)
     */
    pubKey?: Uint8Array;
    /**
     * the v2 signature of the record
     */
    signatureV2: Uint8Array;
    /**
     * extensible data
     */
    data: Uint8Array;
}
export interface IPNSRecordV2 {
    /**
     * value of the record
     */
    value: string;
    /**
     * the v2 signature of the record
     */
    signatureV2: Uint8Array;
    /**
     * Type of validation being used
     */
    validityType: IpnsEntry.ValidityType;
    /**
     * expiration datetime for the record in RFC3339 format
     */
    validity: NanoDate;
    /**
     * number representing the version of the record
     */
    sequence: bigint;
    /**
     * ttl in nanoseconds
     */
    ttl?: bigint;
    /**
     * the public portion of the key that signed this record (only present if it was not embedded in the IPNS key)
     */
    pubKey?: Uint8Array;
    /**
     * extensible data
     */
    data: Uint8Array;
}
export type IPNSRecord = IPNSRecordV1V2 | IPNSRecordV2;
export interface IPNSRecordData {
    Value: Uint8Array;
    Validity: Uint8Array;
    ValidityType: IpnsEntry.ValidityType;
    Sequence: bigint;
    TTL: bigint;
}
export interface IDKeys {
    routingPubKey: Key;
    pkKey: Key;
    routingKey: Key;
    ipnsKey: Key;
}
export interface CreateOptions {
    lifetimeNs?: bigint;
    v1Compatible?: boolean;
}
export interface CreateV2OrV1Options {
    v1Compatible: true;
}
export interface CreateV2Options {
    v1Compatible: false;
}
/**
 * Creates a new IPNS record and signs it with the given private key.
 * The IPNS Record validity should follow the [RFC3339]{@link https://www.ietf.org/rfc/rfc3339.txt} with nanoseconds precision.
 * Note: This function does not embed the public key. If you want to do that, use `EmbedPublicKey`.
 *
 * The passed value can be a CID, a PeerID or an arbitrary string path.
 *
 * * CIDs will be converted to v1 and stored in the record as a string similar to: `/ipfs/${cid}`
 * * PeerIDs will create recursive records, eg. the record value will be `/ipns/${cidV1Libp2pKey}`
 * * String paths will be stored in the record as-is, but they must start with `"/"`
 *
 * @param {PeerId} peerId - peer id containing private key for signing the record.
 * @param {CID | PeerId | string} value - content to be stored in the record.
 * @param {number | bigint} seq - number representing the current version of the record.
 * @param {number} lifetime - lifetime of the record (in milliseconds).
 * @param {CreateOptions} options - additional create options.
 */
export declare function create(peerId: PeerId, value: CID | PeerId | string, seq: number | bigint, lifetime: number, options?: CreateV2OrV1Options): Promise<IPNSRecordV1V2>;
export declare function create(peerId: PeerId, value: CID | PeerId | string, seq: number | bigint, lifetime: number, options: CreateV2Options): Promise<IPNSRecordV2>;
export declare function create(peerId: PeerId, value: CID | PeerId | string, seq: number | bigint, lifetime: number, options: CreateOptions): Promise<IPNSRecordV1V2>;
/**
 * Same as create(), but instead of generating a new Date, it receives the intended expiration time
 * WARNING: nano precision is not standard, make sure the value in seconds is 9 orders of magnitude lesser than the one provided.
 *
 * The passed value can be a CID, a PeerID or an arbitrary string path.
 *
 * * CIDs will be converted to v1 and stored in the record as a string similar to: `/ipfs/${cid}`
 * * PeerIDs will create recursive records, eg. the record value will be `/ipns/${cidV1Libp2pKey}`
 * * String paths will be stored in the record as-is, but they must start with `"/"`
 *
 * @param {PeerId} peerId - PeerId containing private key for signing the record.
 * @param {CID | PeerId | string} value - content to be stored in the record.
 * @param {number | bigint} seq - number representing the current version of the record.
 * @param {string} expiration - expiration datetime for record in the [RFC3339]{@link https://www.ietf.org/rfc/rfc3339.txt} with nanoseconds precision.
 * @param {CreateOptions} options - additional creation options.
 */
export declare function createWithExpiration(peerId: PeerId, value: CID | PeerId | string, seq: number | bigint, expiration: string, options?: CreateV2OrV1Options): Promise<IPNSRecordV1V2>;
export declare function createWithExpiration(peerId: PeerId, value: CID | PeerId | string, seq: number | bigint, expiration: string, options: CreateV2Options): Promise<IPNSRecordV2>;
export declare function createWithExpiration(peerId: PeerId, value: CID | PeerId | string, seq: number | bigint, expiration: string, options: CreateOptions): Promise<IPNSRecordV1V2>;
/**
 * Get key for storing the record locally.
 * Format: /ipns/${base32(<HASH>)}
 *
 * @param {Uint8Array} key - peer identifier object.
 */
export declare const getLocalKey: (key: Uint8Array) => Key;
export { unmarshal } from './utils.js';
export { marshal } from './utils.js';
export { peerIdToRoutingKey } from './utils.js';
export { peerIdFromRoutingKey } from './utils.js';
export { extractPublicKey } from './utils.js';
//# sourceMappingURL=index.d.ts.map