import React from "react";
import PropTypes from "prop-types";

class Title extends React.Component {
    constructor(props) {
        this.state = {
            next: null
        }
    };

    handleClick = () => {
        this.props.clickHandler(this.props.name);
    };

    render() {
        const className = [
            "component-title",
            this.props.orange ? "orange" : "",
            this.props.wide ? "wide" : "",
        ];

        return (
            <div className={className.join(" ").trim()}>
                <h1 onClick={this.handleClick}>{this.props.name}</h1>
            </div>
        );
    }
}
Title.propTypes = {
    name: PropTypes.string,
    orange: PropTypes.bool,
    wide: PropTypes.bool,
    clickHandler: PropTypes.func,
};
export default Title;
