import React from "react";
import Title from "./Title"
import PropTypes from "prop-types";

const Nav = (props) => {
    return (
        <nav>
            <Title>{props.title}</Title>
            <ul className="nav">
                <li>navigation 1</li>
                <li>navigation 2</li>
                <li>navigation 3</li>
            </ul>
        </nav>
    )
}

Nav.propTypes = {
    title: PropTypes.string
}

export default Nav
