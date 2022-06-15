import fs from 'fs';
import path from 'path';

const choices = fs.readdirSync(path.join(__dirname, 'templates'));

export default choices;
