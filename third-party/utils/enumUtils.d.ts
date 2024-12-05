type EnumValue = string | number;
type EnumObject = Record<string, EnumValue>;
export declare function getKeyByValue<E extends EnumObject>(obj: E, value: E[keyof E]): keyof E | undefined;
export declare function getValueByKey<E extends EnumObject>(obj: E, enumKey: keyof E): E[keyof E] | undefined;
export {};
//# sourceMappingURL=enumUtils.d.ts.map