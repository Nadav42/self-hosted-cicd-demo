const spawn = require('child_process').spawn;

const getShellProc = (shell?: string) => {
	let shellFile = '/bin/sh';
	if (process.platform === 'win32') {
		shellFile = process.env.comspec || 'cmd.exe';
	} else if (process.platform === 'android') {
		shellFile = '/system/bin/sh'
	}

	shellFile = shell || shellFile;

	// Spawn the proc and return
	return spawn(shellFile, { shell: false });
}

const getPersistentShell = (shell?: string) => {
	const shellProc = getShellProc(shell);

	let chunks: string[] = [];

	const dataListeners: Array<(data: string) => void> = [];
	const errorListeners: Array<(data: unknown) => void> = [];
	const exitListeners: Array<(data: string) => void> = [];

	shellProc.stdout.on('data', (data: any) => {
		data = data.toString();
		chunks.push(data);
		dataListeners.forEach(f => f(data));
	});

	shellProc.on('exit', (exitCode: any) => {
		if (exitCode === 0) {
			exitListeners.forEach(f => f(chunks.join('')));
		} else {
			errorListeners.forEach(f => f(chunks.join('')));
		}
	});

	shellProc.on('error', (err: unknown) => errorListeners.forEach(f => f(err)));

	const awaitableResult = new Promise((res, rej) => {
		errorListeners.push(rej);
		exitListeners.push(res);
	});

	/**
	 * Execute a command
	 * @param {string} cmd
	 * @param {number} dataLength
	 */
	const execCmd = async (cmd: string, dataLength = 1, capture = true) => {
		let result = null;

		if (capture) {
			const cmdResChunks: string[] = [];
			result = new Promise((res, rej) => {
				dataListeners.push((data) => {
					cmdResChunks.push(data.toString());
					if (cmdResChunks.length >= dataLength) {
						res(cmdResChunks.join(''));
					}
				});
			});
		}

		cmd = cmd.endsWith('\n') ? cmd : (cmd + '\n');
		shellProc.stdin.write(cmd);
		return result;
	}

	const execCmdWithoutCapture = (cmd: string, dataLength: number) => {
		execCmd(cmd, dataLength, false);
		return null;
	}

	return {
		process: shellProc,
		finalResult: awaitableResult,
		execCmd,
		execCmdWithoutCapture
	}
}

module.exports = {
	getPersistentShell
}