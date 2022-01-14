import { shellExecutor } from './shellExecutor';
import { PersistentShellExecutor } from './persistentShellExecutor';
import { sleep } from './utils';

const test = async () => {
	const cmd1 = await shellExecutor.bash("x=5");
	console.log(cmd1);

	const cmd2 = await shellExecutor.bash("echo %x% ${x} $x");
	console.log(cmd2);

	const cmd3 = await shellExecutor.bash('x=5 && echo "${x} $x"');
	console.log(cmd3);

	const cmd4 = await shellExecutor.bash('./shell-scripts/test.sh');
	console.log(cmd4);
}

const test2 = async () => {
	const persistentShellExecutor = new PersistentShellExecutor();

	await sleep(1000);

	await persistentShellExecutor.printCmd('ls', { waitForOutput: true });

	await persistentShellExecutor.printCmd('cd ./src && pwd', { waitForOutput: true });

	await persistentShellExecutor.printCmd('ls', { waitForOutput: true });

	await persistentShellExecutor.printCmd('x=100 && echo "set x success"', { waitForOutput: true });

	await persistentShellExecutor.printCmd('echo "%x% ${x} $x"', { waitForOutput: true });

	await persistentShellExecutor.printCmd('cd .. && pwd', { waitForOutput: true });

	await persistentShellExecutor.printCmd('./shell-scripts/test.sh', { waitForOutput: true });

	persistentShellExecutor.close();
}

export const testMain = () => {
	// test();
	test2();
}

// RESULT: state doesn't persists between execs, either:
// 1. use persistent shell process
// 2. use exec to execute .sh files that do clear at the end and return the final result
