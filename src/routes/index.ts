import path from 'path';
import glob from 'glob';
import router from './router';

// require all sub routes, this should not be changed
['./src/routes/*/*.ts'].forEach((folderPath) => {
    console.log('[routes]', folderPath, glob.sync(folderPath).length);

    glob.sync(folderPath).forEach(function (file) {
        console.log("[require route file]", file);
        require(path.resolve(file));
    });
});


export default router;