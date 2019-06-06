import * as path from 'path';
import * as fg from 'fast-glob';
import chalk from 'chalk';
import { promises as fs } from 'fs';

const paths = [
    path.join(process.env.HOME, '**/node_modules/'),
    '!' + path.join(process.env.HOME, 'Library/**'),
    '!' + path.join(process.env.HOME, '**/node_modules/**/node_modules')
];

const stream = fg.stream(paths, {onlyDirectories: true})
let added = 0;
let exists = 0;
 
stream.on('data', (entry) => {
    const target = path.join(entry, '.metadata_never_index');
    fs.stat(target)
        .then(s => {
            exists = exists + 1;
            console.log(`${chalk.green('EXISTS')} ${chalk.grey(entry)}`);
        })
        .catch(e => {
            fs.writeFile(target, '')
                .then(() => {
                    added = added + 1;
                    console.log(`${chalk.red('ADDED ')} ${chalk.grey(entry)}`);
                })
            
        });
});
stream.once('error', console.log);
stream.once('end', () => console.log(`${added} added, ${exists} already added.`));