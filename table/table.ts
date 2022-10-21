import type { Filter, Instance, Model, PrimaryKey } from "./type.ts";
import { File } from "./file.ts";
import { Block } from "./block.ts";

export class Table<M extends Model<any>, K extends PrimaryKey<M>> {
    public readonly block: number;
    public readonly primary?: K;
    public readonly model: M;
    public readonly file: File;

    private void = new Array<number>();
    private map = new Map<Instance<M>[K], number>();

    constructor(path: string, model: M, primary?: K) {
        this.block = 0;
        this.primary = primary;
        this.model = model;

        for (const key in model) {
            this.block += model[key][1];
        }

        this.file = new File(path, this.block);

        for (let position = 0; position < this.file.length; position++) {
            if (this.file.state(position) == 0) {
                this.void.push(position);
            }
        }

        if (this.primary) {
            for (let position = 0; position < this.file.length; position++) {
                if (this.file.state(position) != 0) {
                    this.map.set(this.read(position)[this.primary], position);
                }
            }
        }
    }

    private read(position: number) {
        const reader = new Block.Reader(this.file.read(position)),
            instance: any = {};

        for (const key in this.model) {
            const [type, size] = this.model[key];

            switch (type) {
                case "string": {
                    instance[key] = reader.readString(size);
                    break;
                }
                case "uint8": {
                    instance[key] = reader.readUint8();
                    break;
                }
                case "uint16": {
                    instance[key] = reader.readUint16();
                    break;
                }
                case "uint32": {
                    instance[key] = reader.readUint32();
                    break;
                }
                case "uint64": {
                    instance[key] = reader.readUint64();
                    break;
                }
                case "int8": {
                    instance[key] = reader.readInt8();
                    break;
                }
                case "int16": {
                    instance[key] = reader.readInt16();
                    break;
                }
                case "int32": {
                    instance[key] = reader.readInt32();
                    break;
                }
                case "int64": {
                    instance[key] = reader.readInt64();
                    break;
                }
                case "float32": {
                    instance[key] = reader.readFloat32();
                    break;
                }
                case "float64": {
                    instance[key] = reader.readFloat64();
                    break;
                }
                case "boolean": {
                    instance[key] = reader.readBoolean();
                    break;
                }
                case "bin": {
                    instance[key] = reader.readBinary(size);
                    break;
                }
            }
        }

        return instance as Instance<M>;
    }

    private write(position: number, instance: Instance<M>) {
        const block = new Uint8Array(this.block),
            writer = new Block.Writer(block);

        for (const key in this.model) {
            const [type, size] = this.model[key];

            switch (type) {
                case "string": {
                    writer.writeString(size, instance[key] as string);
                    break;
                }
                case "uint8": {
                    writer.writeUint8(instance[key] as number);
                    break;
                }
                case "uint16": {
                    writer.writeUint16(instance[key] as number);
                    break;
                }
                case "uint32": {
                    writer.writeUint32(instance[key] as number);
                    break;
                }
                case "uint64": {
                    writer.writeUint64(instance[key] as bigint);
                    break;
                }
                case "int8": {
                    writer.writeInt8(instance[key] as number);
                    break;
                }
                case "int16": {
                    writer.writeInt16(instance[key] as number);
                    break;
                }
                case "int32": {
                    writer.writeInt32(instance[key] as number);
                    break;
                }
                case "int64": {
                    writer.writeInt64(instance[key] as bigint);
                    break;
                }
                case "float32": {
                    writer.writeFloat32(instance[key] as number);
                    break;
                }
                case "float64": {
                    writer.writeFloat64(instance[key] as number);
                    break;
                }
                case "boolean": {
                    writer.writeBoolean(instance[key] as boolean);
                    break;
                }
                case "bin": {
                    writer.writeBinary(size, instance[key] as ArrayBuffer);
                    break;
                }
            }
        }

        this.file.write(position, block);
    }

    private *filter(filter: Filter<M, K>) {
        if (typeof filter == "function") {
            for (let position = 0; position < this.file.length; position++) {
                if (this.file.state(position) != 0) {
                    const instance = this.read(position);
                    if (filter(instance)) {
                        yield { position, instance };
                    }
                }
            }
        } else {
            const position = this.map.get(filter as Instance<M>[K]);
            if (position != undefined) {
                const instance = this.read(position);
                yield { position, instance };
            }
        }
    }

    public create(instance: Instance<M>) {
        const position = this.void.shift() || this.file.length;
        this.write(position, instance);

        if (this.primary) {
            this.map.set(instance[this.primary], position);
        }
    }

    public select(filter: Filter<M, K>): Instance<M>[] {
        const result = new Array<Instance<M>>();

        for (const { instance } of this.filter(filter)) {
            result.push(instance);
        }

        return result;
    }

    public update(change: Partial<Instance<M>>, filter: Filter<M, K>) {
        let count = 0;

        for (const { position, instance } of this.filter(filter)) {
            this.write(position, { ...instance, ...change });
            count++;
        }

        return count;
    }

    public delete(filter: Filter<M, K>) {
        let count = 0;

        for (const { position, instance } of this.filter(filter)) {
            this.file.erase(position);
            this.void.push(position);

            if (this.primary) {
                this.map.delete(instance[this.primary]);
            }

            count++;
        }

        return count;
    }
}
