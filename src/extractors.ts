import { NodePath, Node } from '@babel/traverse'

/**
 * Get React component defined by Class
 * @param {Node} node
 * @return {string | null} Component name
 */
export const componentFromClassDeclaration = (node: Node): string | null => {
    if (node.type === 'ClassDeclaration' && node.superClass && node.id) {
        if (
            (node.superClass.type === 'MemberExpression'
                && node.superClass.object.type === 'Identifier'
                && node.superClass.object.name === 'React'
                && node.superClass.property.name === 'Component')
            || (node.superClass.type === 'Identifier'
                && node.superClass.name === 'Component')
        ) {
            return node.id.name
        }
    }

    return null
}

/**
 * Check if a returnStatement node returns a JSX element
 * @param {Node} node
 * @return {boolean}
 */
export const hasJSXElement = (node: Node): boolean | null => {
    return (node.type === 'ReturnStatement'
        && node.argument && node.argument.type === 'JSXElement')
        || (node.type === 'ArrowFunctionExpression'
            && node.body.type === 'JSXElement')
}

/**
 * Recursive function to get component name from Node's parent
 * @param {NodePath} path
 * @return {string | null} component name
 */
export const getVariableDeclarationParent = (path: NodePath): string | null => {
    if (path.parent.type === 'VariableDeclarator' && path.parent.id.type === 'Identifier') {
        return path.parent.id.name
    } else {
        return path.parentPath ? getVariableDeclarationParent(path.parentPath) : null
    }
}

/**
 * Get React component props when propTypes are defined
 * @param {Node} node
 * @param {string} componentName
 * @return {string[] | null} props list
 */
export const propsFromPropTypes = (node: Node, componentName: string): string[] | null => {
    if (node.type === 'AssignmentExpression'
        && node.left.type === 'MemberExpression'
        && node.right.type === 'ObjectExpression'
        && node.left.object.type === 'Identifier'
        && node.left.object.name === componentName
        && node.left.property.name === 'propTypes'
    ) {
        return node.right.properties.map(property =>
            property.type === 'ObjectProperty' ? property.key.name : undefined)
    }

    return null
}

/**
 * Get React component props when propTypes are defined
 * @param {Node} node
 * @return {string[] | null} state elements
 */
export const stateFromConstructor = (node: Node): string[] | null => {
    if (node.type === 'AssignmentExpression'
        && node.left.type === 'MemberExpression'
        && node.right.type === 'ObjectExpression'
        && node.left.object.type === 'ThisExpression'
        && node.left.property.name === 'state'
    ) {
        return node.right.properties.map(property =>
            property.type === 'ObjectProperty' ? property.key.name : undefined)
    }

    return null
}

/**
 * Get React component name from parent Component render method
 * @param {Node} node
 * @return {string | null} component name
 */
export const componentsFromRender = (node: Node): string | null => {
    if (node.type === 'JSXElement'
        && node.openingElement.type === 'JSXOpeningElement'
        && node.openingElement.name.type === 'JSXIdentifier'
    ) {
        return node.openingElement.name.name
    }

    return null
}
