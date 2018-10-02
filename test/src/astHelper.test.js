const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const assert = require('assert')
const constants = require('../../lib/constants')
const astHelper = require('../../lib/astHelper')

const getSampleAST = (component = 'Title') => {
    const content = fs.readFileSync(path.join(__dirname, `../components/${component}.js`), { encoding: 'utf-8' })
    return parser.parse(content, {
        sourceType: 'module',
        plugins: ["jsx", "classProperties", "objectRestSpread"]
    })
}

describe('AST helpers', () => {
    describe('getComponent(ast) from class defined component', () => {
        it('should get component name from AST of class defined component', () => {
            const ast = getSampleAST()
            const component = astHelper.getComponent(ast)

            assert.equal(component.name, 'Title')
            assert.equal(component.type, constants.CLASS_DECLARATION)
            assert.deepEqual(component.ast, ast)
        })
    })

    describe('getComponent(ast) from functional component', () => {
        it('should get component name from AST of functional component', () => {
            const ast = getSampleAST('Nav')
            const component = astHelper.getComponent(ast)

            assert.equal(component.name, 'Nav')
            assert.equal(component.type, constants.FUNCTIONAL_COMPONENT)
            assert.deepEqual(component.ast, ast)
        })

        it('should get component name from AST defined with arrow function', () => {
            const ast = getSampleAST('Header')
            const component = astHelper.getComponent(ast)

            assert.equal(component.name, 'Header')
            assert.equal(component.type, constants.FUNCTIONAL_COMPONENT)
            assert.deepEqual(component.ast, ast)
        })
    })

    describe('injectProps(component)', () => {
        it('should inject component props from AST', () => {
            const ast = getSampleAST()
            const component = {
                name: 'Title',
                type: constants.CLASS_DECLARATION,
                ast
            }
            const componentWithProps = astHelper.injectProps(component)

            assert.deepEqual(componentWithProps.props, ['name', 'orange', 'wide', 'clickHandler'])
        })
    })

    describe('injectState(component)', () => {
        it('should inject component state from AST', () => {
            const ast = getSampleAST()
            const component = {
                name: 'Title',
                type: constants.CLASS_DECLARATION,
                ast
            }
            const componentWithState = astHelper.injectState(component)

            assert.deepEqual(componentWithState.state, ['next'])
        })
    })

    describe('injectChildrenComponents(component', () => {
        it('should inject component children components from AST', () => {
            const ast = getSampleAST()
            const component = {
                name: 'Title',
                type: constants.CLASS_DECLARATION,
                ast
            }
            const componentWithComponents = astHelper.injectChildrenComponents(component)

            assert.deepEqual(componentWithComponents.components, ['div', 'h1'])
        })
    })
})
