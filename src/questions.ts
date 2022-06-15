import choices from './choices';
import {InputQuestion, ListQuestion} from "inquirer";

const questions: (InputQuestion | ListQuestion)[] = [
    {
        name: 'template',
        type: 'list',
        message: 'What project template would you like to use?',
        choices
    },
    {
        name: 'name',
        type: 'input',
        message: 'New project name?'
    },
    {
        name: 'moduleName',
        type: 'input',
        message: 'Module name (module federation)?'
    },
    {
        name: 'entryFileName',
        type: 'input',
        default: 'entryFile.js',
        message: '(Optional: skip for container) Entry file name (module federation)?',
    }
];

export default questions;
