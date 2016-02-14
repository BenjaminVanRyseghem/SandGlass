(function() {
	"use strict";

	const React = require("react");

	class OptionComponent extends React.Component {

		render() {
            let index = this.props.value.periodIndex();
            let name = this.props.formatter(this.props.value);

			return React.createElement("option", {
                value: index
            }, name);
		}
	}

	module.exports = OptionComponent;
})();
