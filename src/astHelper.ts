import fs from 'fs'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import { File } from '@babel/types'
import {
    componentFromClassDeclaration,
    hasJSXElement,
    getVariableDeclarationParent,
    propsFromPropTypes,
    stateFromConstructor,
    componentsFromRender,
} from './extractors'
import { CLASS_DECLARATION, FUNCTIONAL_COMPONENT } from './constants'

export interface componentObject {
    name: string,
    type: string,
    props?: string[],
    state?: string[],
    components?: string[],
    ast?: File,
}

/**
 * Generate AST from given file
 * @param {string} file
 * @return {File}
 */
export const generateAst = (file: string): File => {
    const content = fs.readFileSync(file, { encoding: 'utf-8' })
    return parser.parse(content, {
        sourceType: 'module',
        plugins: ["jsx", "classProperties", "objectRestSpread"]
    })
}

/**
 * get component from a given AST if exists
 * @param {File} ast
 * @return {componentObject}
 */
export const getComponent = (ast: File): componentObject => {
    let component: componentObject = { name: '', type: '' }

    traverse(ast, {
        enter(path) {
            const componentName = componentFromClassDeclaration(path.node)
            if (componentName) {
                component = {
                    name: componentName,
                    type: CLASS_DECLARATION,
                    ast
                }
            } else if (hasJSXElement(path.node)) {   // check if functional component
                const functionalComponentName = getVariableDeclarationParent(path)
                if (functionalComponentName) {
                    component = {
                        name: functionalComponentName,
                        type: FUNCTIONAL_COMPONENT,
                        ast
                    }
                }
            }
        }
    })

    return component
}

/**
 * Inject props from component's AST
 * @param {componentObject} component
 * @return {componentObject}
 */
export const injectProps = (component: componentObject): componentObject => {
    const componentWithProps = Object.assign({}, component)
    if (component.ast) {
        switch (component.type) {
            case CLASS_DECLARATION:
                traverse(component.ast, {
                    enter(path) {
                        const props = propsFromPropTypes(path.node, component.name)
                        if (props) {
                            componentWithProps.props = props
                        }
                    }
                })
                break;

            default:
                break;
        }
    }

    return componentWithProps
}

/**
 * Inject state from component's AST
 * @param {componentObject} component
 * @return {componentObject}
 */
export const injectState = (component: componentObject): componentObject => {
    const componentWithState = Object.assign({}, component)
    if (component.ast) {
        switch (component.type) {
            case CLASS_DECLARATION:
                traverse(component.ast, {
                    enter(path) {
                        const state = stateFromConstructor(path.node)
                        if (state) {
                            componentWithState.state = state
                        }
                    }
                })
                break;

            default:
                break;
        }
    }

    return componentWithState
}

export const injectChildrenComponents = (component: componentObject) => {
    const componentWithComponents = Object.assign({ components: [] }, component)
    if (component.ast) {
        traverse(component.ast, {
            enter(path) {
                const extractedComponent = componentsFromRender(path.node)
                if (extractedComponent &&
                    !componentWithComponents.components.includes(extractedComponent)
                ) {
                    componentWithComponents.components.push(extractedComponent)
                }
            }
        })
    }

    return componentWithComponents
}
