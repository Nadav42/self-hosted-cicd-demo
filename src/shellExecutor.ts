const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

interface IBashResult {
	err?: unknown;
	stdout?: string;
	stderr?: string;
}

export class ShellExecutor {
	bash = async (cmd: string): Promise<IBashResult> => {
		console.log("[ShellExecutor]", cmd);

		try {
			const { stdout, stderr } = await exec(cmd)
			return { err: undefined, stdout, stderr };
		} catch (err) {
			return { err, stdout: undefined, stderr: undefined };
		}
	}
}

export const shellExecutor = new ShellExecutor();