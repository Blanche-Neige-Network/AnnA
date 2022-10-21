import { Attribute } from "./type.ts";

export const Str = <S extends number>(
    size: S,
): Attribute<"string", S> => ["string", size];

export const Uint8: Attribute<"uint8", 1> = ["uint8", 1];

export const Uint16: Attribute<"uint16", 2> = ["uint16", 2];

export const Uint32: Attribute<"uint32", 4> = ["uint32", 4];

export const Uint64: Attribute<"uint64", 8> = ["uint64", 8];

export const Int8: Attribute<"int8", 1> = ["int8", 1];

export const Int16: Attribute<"int16", 2> = ["int16", 2];

export const Int32: Attribute<"int32", 4> = ["int32", 4];

export const Int64: Attribute<"int64", 8> = ["int64", 8];

export const Float32: Attribute<"float32", 4> = ["float32", 4];

export const Float64: Attribute<"float64", 8> = ["float64", 8];

export const Bool: Attribute<"boolean", 1> = ["boolean", 1];

export const Bin = <S extends number>(
    size: S,
): Attribute<"bin", S> => ["bin", size];
