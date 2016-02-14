(function() {
    "use strict";

    const fs = require("fs");

    let string = fs.readFileSync(`${__dirname}/../package.json`);
    let packageInfo = JSON.parse(string);

    packageInfo.longCopyright = `Copyright © ${packageInfo.year} ${packageInfo.author.name}`;
    packageInfo.longCopyright += `<${packageInfo.author.email}>`;

    packageInfo.longLicense = `Licence ${packageInfo.license} (${packageInfo.licenseUrl})`;

    let longVersion = `${packageInfo.name} v${packageInfo.version}\n`;
    longVersion += `${packageInfo.longCopyright}\n`;
    longVersion += `${packageInfo.longLicense}`;

    packageInfo.longVersion = longVersion;

    module.exports = packageInfo;
})();
