import React from 'react'
import PropTypes from 'prop-types'
import uuidv4 from 'uuid/v4'

const Node = (props) => {
    const {
        component: { name, components: children },
        components,
        onSelectNode
    } = props
    return (
        <li>
            <span
                className="component-name"
                onClick={() => { onSelectNode(name) }}
            >{name}</span>

            {children
                ? (
                    <ul>
                        {children.map(c => (
                            <Node
                                key={uuidv4()}
                                component={components[c]}
                                components={components}
                                onClick={() => { onSelectNode(name) }}
                                onSelectNode={onSelectNode}
                            />
                        ))}
                    </ul>
                )
                : ''
            }
        </li>
    )
}

Node.propTypes = {
    component: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        state: PropTypes.arrayOf(PropTypes.string),
        components: PropTypes.arrayOf(PropTypes.string),
    }),
    components: PropTypes.object,
    onSelectNode: PropTypes.func
}

export default Node
