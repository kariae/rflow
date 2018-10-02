import fs from 'fs'
import globby from 'globby'
import { componentObject } from './astHelper'

/**
 * Get list of files in given directory
 * @param {string} dir
 * @return {Promise<string[]>}
 */
// const getList = (dir) => globby('/Users/zakariae/projects/rflow/examples/calculator/src/component/Button.js', {
const getList = (dir: string): Promise<string[]> => globby(dir, {
    expandDirectories: {
        files: ['*'],
        extensions: ['js', 'jsx']
    }
})

/**
 * Save components as json file
 * @param {string} output
 * @param {string} components
 */
const saveComponents = (frontOutput: string | boolean, output: string, components: Object): void => {
    const json = JSON.stringify(components)
    // save for front server
    if (typeof (frontOutput) === 'string') {
        fs.writeFile(frontOutput, json, (err) => {
            if (err) throw err;
        })
    }

    // save for destination folder
    if (frontOutput !== output) {
        fs.writeFile(output, json, (err) => {
            if (err) throw err;
        })
    }
}

export { getList, saveComponents }
