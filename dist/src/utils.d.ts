import { CID } from 'multiformats/cid';
import { IpnsEntry } from './pb/ipns.js';
import type { IPNSRecord, IPNSRecordV2, IPNSRecordData } from './index.js';
import type { PublicKey, PeerId } from '@libp2p/interface';
/**
 * Extracts a public key from the passed PeerId, falling
 * back to the pubKey embedded in the ipns record
 */
export declare const extractPublicKey: (peerId: PeerId, record: IPNSRecord | IPNSRecordV2) => Promise<PublicKey>;
/**
 * Utility for creating the record data for being signed
 */
export declare const ipnsRecordDataForV1Sig: (value: Uint8Array, validityType: IpnsEntry.ValidityType, validity: Uint8Array) => Uint8Array;
/**
 * Utility for creating the record data for being signed
 */
export declare const ipnsRecordDataForV2Sig: (data: Uint8Array) => Uint8Array;
export declare const marshal: (obj: IPNSRecord | IPNSRecordV2) => Uint8Array;
export declare function unmarshal(buf: Uint8Array): IPNSRecord;
export declare const peerIdToRoutingKey: (peerId: PeerId) => Uint8Array;
export declare const peerIdFromRoutingKey: (key: Uint8Array) => PeerId;
export declare const createCborData: (value: Uint8Array, validityType: IpnsEntry.ValidityType, validity: Uint8Array, sequence: bigint, ttl: bigint) => Uint8Array;
export declare const parseCborData: (buf: Uint8Array) => IPNSRecordData;
/**
 * Normalizes the given record value. It ensures it is a PeerID, a CID or a
 * string starting with '/'. PeerIDs become `/ipns/${cidV1Libp2pKey}`,
 * CIDs become `/ipfs/${cidAsV1}`.
 */
export declare const normalizeValue: (value?: CID | PeerId | string | Uint8Array) => string;
//# sourceMappingURL=utils.d.ts.map