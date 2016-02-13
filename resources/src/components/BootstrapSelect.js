(function() {
    "use strict";

    const React = require("react");
    var Input = require("react-bootstrap").Input;
    const ReactDOM = require("react-dom");

    class BootstrapSelect extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                open: false
            };

            this.handler = this.clickHandler.bind(this);
        }

        clickHandler() {
            this.setState({open: false});
        }

        componentDidUpdate() {
            $(ReactDOM.findDOMNode(this)).find("select").selectpicker("refresh");
            var select = $(ReactDOM.findDOMNode(this)).find("div.bootstrap-select");
            select.toggleClass("open", this.state.open);
        }

        componentWillUnmount() {
            var self = this;
            var select = $(ReactDOM.findDOMNode(this)).find("select");

            var button = $(ReactDOM.findDOMNode(this)).find("button");
            var dropdown = $(ReactDOM.findDOMNode(this)).find(".dropdown-menu.open");
            var items = $(ReactDOM.findDOMNode(this)).find("ul.dropdown-menu li a");

            $("html").off("click", this.handler);
            button.off("click");
            items.off("click");
        }

        componentDidMount() {
            var self = this;
            var select = $(ReactDOM.findDOMNode(this)).find("select");

            $(select).selectpicker(this.props.pickerOptions);

            var button = $(ReactDOM.findDOMNode(this)).find("button");
            var dropdown = $(ReactDOM.findDOMNode(this)).find(".dropdown-menu.open");

            // This sound unused
            setTimeout(function() {
                var items = $(ReactDOM.findDOMNode(self)).find("ul.dropdown-menu li");

                items.click(() => {
                    if (self.props.multiple) {
                        return;
                    }
                    self.setState({open: !self.state.open});
                });
            }, 0);

            $("html").on("click", this.handler);

            button.click(function(e) {
                e.stopPropagation();
                self.setState({open: !self.state.open});
            });
        }

        render() {
            return React.createElement("span", null,
                React.createElement("select", this.props,
                    this.props.children
                )
            );
        }
    }

    module.exports = BootstrapSelect;
})();
