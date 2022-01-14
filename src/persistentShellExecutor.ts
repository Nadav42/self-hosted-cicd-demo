const spawn = require('child_process').spawn;

interface IRunOptions {
	waitForOutput: boolean;
	timeoutMs?: number;
}

export class PersistentShellExecutor {
	private shellProc: any;
	private chunks: string[] = [];
	private dataListeners: Array<(data: string) => void> = [];
	private errorListeners: Array<(error: unknown) => void> = [(error) => console.log("[PersistentShellExecutor] [errorListeners]", error)];
	private exitListeners: Array<(data: string) => void> = []; // (data) => console.log("[exitListeners]", data)

	constructor() {
		this.shellProc = this.getShellProc();

		this.shellProc.stdout.on('data', (data: any) => {
			data = data.toString();
			this.chunks.push(data);
			this.dataListeners.forEach(f => f(data));
		});

		this.shellProc.on('exit', (exitCode: any) => {
			if (exitCode === 0) {
				this.exitListeners.forEach(f => f(this.chunks.join('')));
			} else {
				this.errorListeners.forEach(f => f(this.chunks.join('')));
			}
		});

		this.shellProc.on('error', (err: unknown) => this.errorListeners.forEach(f => f(err)));
	}

	private getShellProc = (shell?: string) => {
		let shellFile = '/bin/sh';

		if (process.platform === 'win32') {
			shellFile = process.env.comspec || 'cmd.exe';
		}

		shellFile = shell || shellFile;

		// Spawn the proc and return
		return spawn(shellFile, { shell: false });
	}

	execCmd = async (cmd: string, options: IRunOptions) => {
		let result = null;
		const timeout = options.timeoutMs || 10000;

		console.log("[PersistentShellExecutor]", cmd);

		if (options.waitForOutput) {
			const cmdResChunks: string[] = [];

			result = new Promise((resolve, reject) => {
				const rejectAfterTimeout = setTimeout(() => reject(`[PersistentShellExecutor] [execCmd] timed out after ${timeout}ms`), timeout);

				const handleResult = (data: any) => {
					cmdResChunks.push(data.toString());
					clearTimeout(rejectAfterTimeout);
					resolve(cmdResChunks.join(''));
				};

				this.dataListeners.push(handleResult);
			});
		}

		cmd = cmd.endsWith('\n') ? cmd : (cmd + '\n');
		this.shellProc.stdin.write(cmd);
		return result;
	}

	printCmd = async (cmd: string, options: IRunOptions) => {
		const res = await this.execCmd(cmd, options);
		console.log('result:', res);
	}

	close = () => {
		this.shellProc.stdin.end();
	}
}

