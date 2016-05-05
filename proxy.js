var fetch = require('node-fetch');

module.exports = function() {
    return fetch.apply(null, arguments).then(function(res) {
        return res.json();
    });
};
