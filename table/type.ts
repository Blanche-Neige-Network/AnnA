export type Type =
    | "string"
    | "uint8"
    | "uint16"
    | "uint32"
    | "uint64"
    | "int8"
    | "int16"
    | "int32"
    | "int64"
    | "float32"
    | "float64"
    | "boolean"
    | "bin";

export type Parse<T> = T extends "string" ? string
    : T extends
    | "uint8"
    | "uint16"
    | "uint32"
    | "int8"
    | "int16"
    | "int32"
    | "float32"
    | "float64" ? number
    : T extends "uint64" | "int64" ? bigint
    : T extends "boolean" ? boolean
    : T extends "bin" ? ArrayBuffer
    : never;

export type Attribute<T extends Type, S extends number> = [T, S];

export type Model<K extends string> = Record<K, Attribute<Type, number>>;

export type Execute<T> = T;

export type Instance<M extends Model<any>> = Execute<
    {
        [K in keyof M]: Parse<M[K][0]>;
    }
>;

export type PrimaryKey<M extends Model<any>> = keyof Instance<M> | undefined;

export type Filter<M extends Model<any>, K extends PrimaryKey<M>> = K extends
    undefined ? (value: Instance<M>) => boolean
    : Instance<M>[K] | ((instance: Instance<M>) => boolean);

//export type Filter<T> = (value: T) => boolean;
