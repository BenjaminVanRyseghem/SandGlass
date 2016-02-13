(function() {
    "use strict";

    const React = require("react");

    const remote = require("remote");
    const info = remote.require("../src/info");

    const ContributorComponent = require("./ContributorComponent");

    class AboutComponent extends React.Component {
        render() {
            return React.createElement("div", null,

                React.createElement("h1", {className: "app-title"},
                    React.createElement("img", {className: "app-icon"}),
                    React.createElement("div", {className: "app-name"},
                        info.name
                    ),
                    React.createElement("p", {className: "app-version small"},
                        `Version ${info.version}`
                    )
                ),
                React.createElement("div", {className: "contributors"},
                    React.createElement("div", {className: "title"},
                        "Contributors"
                    ),
                    React.createElement("ul", null,
                        info.contributors.map((contributor) => {
                            return React.createElement(ContributorComponent, {
                                name: contributor.name,
                                url: contributor.url,
                                email: contributor.email,
                                key: contributor.name
                            });
                        })
                    )
                ),
                React.createElement("div", {className: "copyright"}, info.longCopyright)
            );
        }
    }

    module.exports = AboutComponent;
})();
