import React from 'react'
import ReactModal from 'react-modal'
import Node from './Node'
import data from '../output/components.json'

ReactModal.setAppElement('#modal');

class Graph extends React.Component {
    constructor(props) {
        super(props)

        this.state = { children: [], data: {}, selectedComponentName: null }
    }

    componentDidMount() {
        const children = Object.values(data).reduce((c, component) => {
            if (component.components) {
                return c.concat(component.components)
            }
            return c

        }, [])
        this.setState({ children, data })
    }

    isParent = (component) => !this.state.children.includes(component)

    onSelectNode = (selectedComponentName) => {
        this.setState({ selectedComponentName })
    }

    render() {
        const { data: components, selectedComponentName } = this.state
        const selectedComponent = components[selectedComponentName]
        return (
            <div className="graph">
                <ul>
                    {Object.values(components).map(component => (
                        this.isParent(component.name)
                        && <Node
                            key={component.name}
                            component={component}
                            components={components}
                            onSelectNode={this.onSelectNode}
                        />
                    )
                    )}
                </ul>

                {selectedComponentName
                    && <ReactModal
                        isOpen={!!selectedComponentName}
                        contentLabel="onRequestClose Example"
                        onRequestClose={() => { this.onSelectNode(null) }}
                        className="modal"
                        overlayClassName="overlay"
                        role="dialog"
                    >
                        <h2>{selectedComponent.name}</h2>
                        <ul className="selected-component-information">
                            <li><strong>Name</strong>:<span>{selectedComponent.name}</span></li>
                            <li><strong>Type</strong>:<span>{selectedComponent.type}</span></li>
                            <li>
                                <strong>Props</strong>:
                                {selectedComponent.props
                                    ? <span>{selectedComponent.props.join(", ")}</span>
                                    : <span>None</span>
                                }
                            </li>
                            <li>
                                <strong>State</strong>:
                                {selectedComponent.state
                                    ? <span>{selectedComponent.state.join(", ")}</span>
                                    : <span>None</span>
                                }
                            </li>
                        </ul>
                        <button
                            className="modal-close"
                            onClick={() => { this.onSelectNode(null) }}
                        >x</button>
                    </ReactModal>
                }
            </div>
        )
    }
}

export default Graph
