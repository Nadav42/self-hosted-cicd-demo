import { bash } from './bash';

console.log("hey");

const test = async () => {
	const cmd1 = await bash("x=5");
	console.log(cmd1);

	const cmd2 = await bash("echo %x% ${x} $x");
	console.log(cmd2);

	const cmd3 = await bash('x=5 && echo "${x} $x"');
	console.log(cmd3);

	const cmd4 = await bash('./test.sh');
	console.log(cmd4);
}

test();

// try this:
// make POST that lets you run a command and returns the results

// check if the commands persists?
// if I do oc-login or "x=5"
// will I be loginned in the next command?
// will "echo ${x}" print 5?