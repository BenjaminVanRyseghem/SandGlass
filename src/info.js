(function() {
    "use strict";

    const fs = require("fs");

    var string = fs.readFileSync(`${__dirname}/../package.json`);
    let packageInfo = JSON.parse(string);
    let longVersion = `${packageInfo.name} v${packageInfo.version}\n`;
    longVersion += `Copyright © ${packageInfo.year} ${packageInfo.author.name}<${packageInfo.author.email}>\n`;
    longVersion += `Licence ${packageInfo.license} (${packageInfo.licenseUrl})`;

    packageInfo.longVersion = longVersion;

    module.exports = packageInfo;
})();
