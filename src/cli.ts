#!/usr/bin/env node

import path from 'path'
import program from 'commander'
import nodemon from 'nodemon'
import webpack from 'webpack'
const webpackConfig = require(path.join(__dirname, '../webpack.prod.js'))
import { version } from '../package.json'
import { getList, saveComponents } from './file'
import {
    generateAst,
    getComponent,
    injectProps,
    injectState,
    injectChildrenComponents,
    componentObject,
} from './astHelper'

const DEFAULT_OUTPUT_FILE = path.join(__dirname, '../output/components.json')

program
    .version(version, '-v, --version')
    .option('-d, --dir [dir]', 'Source directory of React application. Defaults to current directory.', process.cwd())
    .option('-p, --front-port [port]', 'Frontend port. Default to 8181.', 8181)
    .option('-o, --output [file]', 'Output file.', DEFAULT_OUTPUT_FILE)
    .option('--no-front', 'Do not launch rflow frontend to see the results, in case you needs only the data.', true)
    .parse(process.argv)

// Files List
getList(program.dir)
    .then(files => {
        const componentsRaw = files
            .map(file => generateAst(file))
            .map(ast => getComponent(ast))
            .filter(component => component.name !== '') // remove undefined
            .map(component =>
                injectChildrenComponents(
                    injectState(
                        injectProps(component)
                    )
                )
            )

        // Clean components list
        const componentsNames = componentsRaw.map(component => component.name)
        const components = componentsRaw.map(component => {
            const filteredComponent = {
                ...component,
                components: component.components.filter(name => componentsNames.includes(name))
            }

            delete filteredComponent.ast

            if (filteredComponent.components.length === 0) {
                delete filteredComponent.components
            }

            return filteredComponent
        })

        const normalizedComponents = components.reduce((a, b) => {
            a[b.name] = b
            return a
        }, {} as { [key: string]: componentObject })

        saveComponents(
            (program.front) ? DEFAULT_OUTPUT_FILE : false,
            program.output,
            normalizedComponents
        )
    })

// Build and serve front server
if (program.front) {
    webpack(webpackConfig, () => {
        nodemon({
            script: path.join(__dirname, '../front/server.js'),
            env: { 'FRONT_PORT': program.frontPort }
        })
    })
}
