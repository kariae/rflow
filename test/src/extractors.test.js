const assert = require('assert')
const extractors = require('../../lib/extractors')

describe('Data extractors', () => {
    describe('componentFromClassDeclaration(node)', () => {
        it('should return component name from ast of class declaration', () => {
            const node = {
                type: 'ClassDeclaration',
                id: { name: 'Button' },
                superClass: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'React' },
                    property: { name: 'Component' }
                }
            }

            assert.equal(extractors.componentFromClassDeclaration(node), 'Button')
        })
    })

    describe('hasJSXElement', () => {
        it('should assert that a node has a JSX element', () => {
            const node = {
                type: 'ReturnStatement',
                argument: {
                    type: 'JSXElement'
                }
            }

            assert.ok(extractors.hasJSXElement(node))
        })
    })

    describe('propsFromPropTypes(node)', () => {
        it('should get props list from propTypes of component', () => {
            const node = {
                type: 'AssignmentExpression',
                left: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'Button' },
                    property: { name: 'propTypes' }
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [
                        { type: 'ObjectProperty', key: { name: 'prop1' } },
                        { type: 'ObjectProperty', key: { name: 'prop2' } }
                    ]
                }
            }
            assert.deepEqual(extractors.propsFromPropTypes(node, 'Button'), ['prop1', 'prop2'])
        })
    })

    describe('stateFromConstructor(node)', () => {
        it('should get state from Component class constructor', () => {
            const node = {
                type: 'AssignmentExpression',
                left: {
                    type: 'MemberExpression',
                    object: { type: 'ThisExpression', name: 'Button' },
                    property: { type: 'MemberExpression', name: 'state' }
                },
                right: {
                    type: 'ObjectExpression',
                    properties: [
                        { type: 'ObjectProperty', key: { type: 'Identifier', name: 'state1' } },
                        { type: 'ObjectProperty', key: { type: 'Identifier', name: 'state2' } }
                    ]
                }
            }

            assert.deepEqual(extractors.stateFromConstructor(node), ['state1', 'state2'])
        })
    })

    describe('componentsFromRender(node)', () => {
        it('should get components names from Component class render method', () => {
            const node = {
                type: 'JSXElement',
                openingElement: {
                    type: 'JSXOpeningElement',
                    name: { type: 'JSXIdentifier', name: 'Button' }
                }
            }

            assert.deepEqual(extractors.componentsFromRender(node), 'Button')
        })
    })
})
