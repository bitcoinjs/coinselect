type VersionArray = [number, number, number];
type VersionInput = VersionArray | string;
export declare const isVersionArray: (arr: unknown) => arr is VersionArray;
export declare const isNewer: (versionX: VersionInput, versionY: VersionInput) => boolean;
export declare const isEqual: (versionX: VersionInput, versionY: VersionInput) => boolean;
export declare const isNewerOrEqual: (versionX: VersionInput, versionY: VersionInput) => boolean;
export declare const normalizeVersion: (version: string) => string;
export {};
//# sourceMappingURL=versionUtils.d.ts.map