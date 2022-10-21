export class File {
    public readonly path: string;

    private readonly fileSystem: Deno.FsFile;
    public readonly blockSize: number;
    private readonly empty: Uint8Array;

    constructor(path: string, blockSize: number) {
        this.path = path;

        this.fileSystem = Deno.openSync(path, {
            read: true,
            write: true,
            create: true,
        });

        this.blockSize = blockSize;
        this.empty = new Uint8Array(this.blockSize + 1);
    }

    public get length() {
        return this.fileSystem.statSync().size / (this.blockSize + 1);
    }

    public state(position: number) {
        const status = new Uint8Array(1);

        this.fileSystem.seekSync(
            position * (this.blockSize + 1),
            Deno.SeekMode.Start,
        );

        this.fileSystem.readSync(status);
        return status[0];
    }

    private update(position: number) {
        const status = new Uint8Array(1);

        this.fileSystem.seekSync(
            position * (this.blockSize + 1),
            Deno.SeekMode.Start,
        );

        this.fileSystem.readSync(status);

        status[0]++;

        if (status[0] == 0) status[0]++;

        this.fileSystem.seekSync(
            position * (this.blockSize + 1),
            Deno.SeekMode.Start,
        );

        this.fileSystem.writeSync(status);
    }

    public read(position: number) {
        const block = new Uint8Array(this.blockSize);

        this.fileSystem.seekSync(
            position * (this.blockSize + 1) + 1,
            Deno.SeekMode.Start,
        );

        this.fileSystem.readSync(block);
        return block;
    }

    public write(position: number, block: Uint8Array) {
        this.update(position);

        this.fileSystem.seekSync(
            position * (this.blockSize + 1) + 1,
            Deno.SeekMode.Start,
        );

        this.fileSystem.writeSync(block);
    }

    public erase(position: number) {
        this.fileSystem.seekSync(
            position * (this.blockSize + 1),
            Deno.SeekMode.Start,
        );

        this.fileSystem.writeSync(this.empty);
    }
}
