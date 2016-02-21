(function() {
    "use strict";

    let disabled = 0;
    let warning = 1;
    let error = 2;

    module.exports =
    {
        "root": true,
        "extends": "eslint:recommended",
        "parserOptions": {
            "ecmaVersion": 6,
            "sourceType": "module",
            "impliedStrict": true
        },
        "env": {
            "browser": true,
            "node": true,
            "jasmine": true,
            "jquery": true,
            "es6": true
        },
        "rules": {
            "semi": [error, "always"],
            "no-var": error,
            "no-useless-constructor": error,
            "arrow-parens": error,
            "arrow-spacing": error,
            "prefer-arrow-callback": warning,
            "prefer-reflect": disabled,
            "prefer-rest-params": warning,
            "prefer-spread": warning,
            "prefer-template": error,
            "no-confusing-arrow": warning,
            "quotes": [error, "double"]
        }
    };
})();
