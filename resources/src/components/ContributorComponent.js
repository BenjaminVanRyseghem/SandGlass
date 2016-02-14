(function() {
    "use strict";

    const React = require("react");
    const shell = require("electron").shell;

    class ContributorComponent extends React.Component {

        render() {
            let children = [
                React.createElement("div", {
                    className: "contributor-name",
                    key: this.props.name
                }, this.props.name)
            ];

            if (this.props.url) {
                children.push(
                    React.createElement("a", {
                            onClick: () => {
                                shell.openExternal(this.props.url);
                            },
                            key: this.props.url
                        },
                        React.createElement("i", {
                            className: "contributor-url fa fa-home"
                        })
                    )
                );
            }

            if (this.props.email) {
                children.push(
                    React.createElement("a", {
                            onClick: () => {
                                shell.openExternal(`mailto:${this.props.email}`);
                            },
                            key: this.props.email
                        },
                        React.createElement("i", {
                            className: "contributor-email fa fa-at"
                        })
                    )
                );
            }

            return React.createElement("li", {className: "contributor"},
                children
            );
        }
    }

    module.exports = ContributorComponent;
})();
