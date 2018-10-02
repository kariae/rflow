import React from 'react'
import Graph from './Graph'
import Logo from './Logo'
import './style.css'

const App = () => (
    <div className="app">
        <Logo style={{ width: '200px', margin: '40px' }} />
        <Graph></Graph>
    </div>
)

export default App
