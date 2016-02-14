(function() {
    "use strict";

    const React = require("react");
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
            let select = $(ReactDOM.findDOMNode(this)).find("div.bootstrap-select");
            select.toggleClass("open", this.state.open);
        }

        componentWillUnmount() {
            let button = $(ReactDOM.findDOMNode(this)).find("button");
            let items = $(ReactDOM.findDOMNode(this)).find("ul.dropdown-menu li a");

            $("html").off("click", this.handler);
            button.off("click");
            items.off("click");
        }

        componentDidMount() {
            let self = this;
            let select = $(ReactDOM.findDOMNode(this)).find("select");

            $(select).selectpicker(this.props.pickerOptions);

            let button = $(ReactDOM.findDOMNode(this)).find("button");

            // This sound unused
            setTimeout(() => {
                let items = $(ReactDOM.findDOMNode(self)).find("ul.dropdown-menu li");

                items.click(() => {
                    if (self.props.multiple) {
                        return;
                    }
                    self.setState({open: !self.state.open});
                });
            }, 0);

            $("html").on("click", this.handler);

            button.click((e) => {
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
