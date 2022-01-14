import router from '../router';
import { shellExecutor } from '../../shellExecutor';
import { PersistentShellExecutor } from '../../persistentShellExecutor';
import { sleep } from '../../utils';

router.post('/shellExecutor', async (req, res) => {
    const commands: string[] = req.body;

    console.log("red.body:", req.body);

    if (!commands || !commands.length) {
        return res.status(400).json({ error: "commands should be string array", commands });
    }

    const results = [];

    for (let index = 0; index < commands.length; index++) {
        const commandStr = commands[index];
        const cmdRes = await shellExecutor.bash(commandStr);
        console.log(cmdRes);
        results.push({ commandStr, cmdRes });
    }

    res.json({ results });
});

router.post('/persistentShellExecutor', async (req, res) => {
    const commands: string[] = req.body;

    if (!commands || !commands.length) {
        return res.status(400).json({ error: "commands should be string array", commands });
    }

    const results = [];
    const persistentShellExecutor = new PersistentShellExecutor();
    await sleep(1000);

    for (let index = 0; index < commands.length; index++) {
        const commandStr = commands[index];
        const cmdRes = await persistentShellExecutor.execCmd(commandStr, { waitForOutput: true });
        console.log(cmdRes);
        results.push({ commandStr, cmdRes });
    }

    persistentShellExecutor.close();

    res.json({ results });
});

export default [];