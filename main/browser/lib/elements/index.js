
'use strict';

module.exports = function (COMPS) {
	require("./lib/stock"	)(COMPS);
	require("./lib/explorer")(COMPS);
	require("./lib/evectr"	)(COMPS);
}
