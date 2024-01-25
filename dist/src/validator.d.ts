import type { PublicKey } from '@libp2p/interface';
/**
 * Validates the given IPNS Record against the given public key. We need a "raw"
 * record in order to be able to access to all of its fields.
 */
export declare const validate: (publicKey: PublicKey, buf: Uint8Array) => Promise<void>;
export declare function ipnsValidator(key: Uint8Array, marshalledData: Uint8Array): Promise<void>;
//# sourceMappingURL=validator.d.ts.map