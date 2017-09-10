const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase: function () {
        return path.basename(process.cwd());
    },
};