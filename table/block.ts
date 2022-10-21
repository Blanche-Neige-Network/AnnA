const decoder = new TextDecoder(), encoder = new TextEncoder();

export namespace Block {
    abstract class Base {
        public readonly block: Uint8Array;

        protected buffer: ArrayBuffer;
        protected view: DataView;

        protected index = 0;

        constructor(block: Uint8Array) {
            this.block = block;
            this.buffer = block.buffer;
            this.view = new DataView(this.buffer);
        }
    }

    export class Reader extends Base {
        public readString(size: number) {
            const string = decoder.decode(
                this.buffer.slice(this.index, this.index + size),
            );

            this.index += size;
            return string.replace(/\0+$/, '');
        }

        public readUint8() {
            const number = this.view.getUint8(this.index);

            this.index += 1;
            return number;
        }

        public readUint16() {
            const number = this.view.getUint16(this.index);

            this.index += 2;
            return number;
        }

        public readUint32() {
            const number = this.view.getUint32(this.index);

            this.index += 4;
            return number;
        }

        public readInt8() {
            const number = this.view.getInt8(this.index);

            this.index += 1;
            return number;
        }

        public readInt16() {
            const number = this.view.getInt16(this.index);

            this.index += 2;
            return number;
        }

        public readInt32() {
            const number = this.view.getInt32(this.index);

            this.index += 4;
            return number;
        }

        public readFloat32() {
            const number = this.view.getFloat32(this.index);

            this.index += 4;
            return number;
        }

        public readFloat64() {
            const number = this.view.getFloat64(this.index);

            this.index += 8;
            return number;
        }

        public readUint64() {
            const bigint = this.view.getBigUint64(this.index);

            this.index += 8;
            return bigint;
        }

        public readInt64() {
            const bigint = this.view.getBigInt64(this.index);

            this.index += 8;
            return bigint;
        }

        public readBoolean() {
            const boolean = this.readUint8();
            return !(boolean == 0);
        }

        public readBinary(size: number) {
            const binary = new Uint8Array(
                this.buffer.slice(this.index, this.index + size),
            );

            this.index += size;
            return binary.buffer;
        }
    }

    export class Writer extends Base {
        public writeString(size: number, string: string) {
            encoder.encodeInto(
                string,
                this.block.subarray(this.index, this.index + size),
            );
            this.index += size;
        }

        public writeUint8(uint8: number) {
            this.view.setUint8(this.index, uint8);
            this.index += 1;
        }

        public writeUint16(uint16: number) {
            this.view.setUint16(this.index, uint16);
            this.index += 2;
        }

        public writeUint32(uint32: number) {
            this.view.setUint32(this.index, uint32);
            this.index += 4;
        }

        public writeInt8(int8: number) {
            this.view.setInt8(this.index, int8);
            this.index += 1;
        }

        public writeInt16(int16: number) {
            this.view.setInt16(this.index, int16);
            this.index += 2;
        }

        public writeInt32(int32: number) {
            this.view.setInt32(this.index, int32);
            this.index += 4;
        }

        public writeFloat32(float32: number) {
            this.view.setFloat32(this.index, float32);
            this.index += 4;
        }

        public writeFloat64(float64: number) {
            this.view.setFloat64(this.index, float64);
            this.index += 8;
        }

        public writeUint64(uint64: bigint) {
             this.view.setBigUint64(this.index, uint64);
            this.index += 8;
        }

        public writeInt64(int64: bigint) {
            this.view.setBigInt64(this.index, int64);
            this.index += 8;
        }

        public writeBoolean(boolean: boolean) {
            this.writeUint8(boolean ? 1 : 0);
        }

        public writeBinary(size: number, binary: ArrayBuffer) {
            const bytes = new Uint8Array(binary, 0, size);
            this.block.set(bytes, this.index);
            this.index += size;
        }
    }
}
