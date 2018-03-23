
/////////////////////////////////////////////////////////////////////////////////////////////
// THINGS TO KNOW:
	//
	// SQL  - <Object> - See help for dffrnt.model
	// AMP  - <String> - AND character (+), for HTTP queries
	// ORS  - <String> -  OR character (;), for HTTP queries
	// PIP  - <String> -  OR character (|), for  SQL queries
	//
	// UER  - <Array>  - See help for Errors.js in dffrnt.router
	// MSG  - <Array>  - See help for Errors.js in dffrnt.router
	// PRM  - <Array>  - See help for Errors.js in dffrnt.router
	//
	// Docs - <Object> - See help for dffrnt.router
	//
	// LG   - <Object> - See help for dffrnt.utils
	// TLS  - <Object> - See help for dffrnt.utils
	// JSN  - <Object> - See help for dffrnt.utils
	//

/////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT
	export default function () { return { // DO NOT CHANGE/REMOVE!!!
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Users: 		{
			Actions: 	{
				// ======================================================================
				"/": {
					Scheme: '/:account([\w\d_-]+)/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:account:ajohnson": "Displays the {{Users}} with a {{User Name}} of 'ajohnson'",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT 	u.user_id, u.display_name, u.verified, u.status, u.tour_done,",
						"			getFullName(u.user_id) as full_name,",
						"			IF(v.value &  2, null, u.first_name) 	AS first_name,",
						"			IF(v.value &  4, null, u.last_name)		AS last_name,",
						"			IF(v.value & 16, null, u.birth_date) 	AS birth_date,",
						"			IF(v.value & 32, null, u.location) 		AS location,",
						"			IF(v.value & 32, null, CONCAT_WS(', ',",
						"										COALESCE(NULLIF(l.city,   ''),NULL),",
						"										COALESCE(NULLIF(l.region, ''),NULL),",
						"										COALESCE(NULLIF(l.country,''),NULL)",
						"									))				AS location_label,",
						"			IF(v.value & 32, null, UPPER(r.code)) 	AS region_code,",
						"			IF(v.value & 32, null, UPPER(f.code)) 	AS country_code,",
						"			u.inserted_at 	AS member_since",
						"FROM 		users 			AS u",
						"LEFT JOIN 	user_visibilities  v ON u.user_id = v.user_fk AND :VISIBLE:",
						"LEFT JOIN	search_locale 	AS l ON u.location = l.id",
						"LEFT JOIN	regions 		AS r ON r.id = l.region_id",
						"LEFT JOIN	countries 		AS f ON f.id = r.country_id",
						"WHERE 		u.display_name IN :ACCOUNT:",
					],
					Params: {
						Account: {
							Default: '',
							Format 	(cls) {
								return SQL.BRKT(SQL.LIST([cls.account],
									[{ split: ORS, match: /^[A-Za-z0-9]+$/, equals: true, join: '","' }]),
								['("','")'], PIP);
							},
							Desc: 	{
								type: { List: "Text", Separator: ORS },
								to: 'param', required: true,
								description: "The user's {{Display Name}}",
								matches: {
									'Display-Name': 'Matches the {{Display Name}} of the {{User}} (([A-Za-z0-9_-]+))'
								},
							}
						},
						Visible: {
							Format  (cls) { return cls.visible; },
							Default: true, Desc: {
								to: 'query', type: 'boolean',
								description: 'Toggle {{Visibility}} layer',
								required: false, matches: {}
							}
						},
						Single: {
							Format  (cls) { return cls.single; },
							Default: false, Desc: {
								to: 'query', type: 'boolean',
								description: 'Return a {{single}} {{User}} only',
								required: false, matches: {}
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[],
					Parse  	(res) {
						var RQ  = this.RQ; if (!!this.QY.single) return res[0];
						return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
					},
					Key: 	'display_name',
				}
			},
			Errors: 	{ BAD_REQ: ['/'] }
		},
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Search:		{
			Actions: 	{
				// ======================================================================
				"/": {
					Scheme: '/:terms((?:(?:(?:[\\w\\d,&_]|\\(|\\)|%20)+|[1-9][0-9]{0,2}(?:[.]\\d{1,3}){3});?)+)/',
					Sub: null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:terms:3;C05063?page=2&limit=1": "Displays the 'second' {{Page}} at a {{Limit}} of 'one' per {{Page}}, where the results match '3' {{or}} 'C05063'",
							"/:terms:res-20005;C07622": "Displays the {{Hotels}} with a {{Client Text ID}} of 'res-20005' {{or}} a {{Navision Code}} of 'C07622'",
							"/:terms:EWRPR": "Displays the {{Hotels}} with a {{Hotel Code}} of 'EWRPR'",
							"/:terms:50.84.142.227": "Displays the {{Hotels}} at the {{IP Address}}, '50.84.142.227'",
						},
					},
					Query: 	[
						"SELECT      :BY:, "+SQL.SOCKET({ link: '/hotels/:cids:%s', columns: ['S.cid'] })+" as info",
						"FROM        (",
						"    SELECT      ct.client_id AS cid, ct.client_text_id AS tid, ct.hotel_code AS hid, ",
						"                ct.navision_code AS nid, ct.client_name AS name, CONCAT(ct.client_id,'<', CONCAT_WS('><',",
						"                    ct.client_text_id,ct.navision_code,ct.hotel_code,ct.client_name,b.brand_name,",
						"                    GROUP_CONCAT(DISTINCT pd.name ORDER BY pd.product_id SEPARATOR '|'),",
						"                    CONCAT('%%',n.ip_server,'%%')",
						"                ), '>')             AS search",
						"    FROM        clients             AS ct",
						"    INNER JOIN  client_brands       AS b  ON ct.brand_id     = b.brand_id",
						"    LEFT  JOIN  client_isp          AS i  ON i.client_id     = ct.client_id",
						"    LEFT  JOIN  client_network_info AS n  ON n.client_isp_id = i.client_isp_id",
						"    LEFT  JOIN  client_products     AS cp ON cp.client_id    = ct.client_id",
						"    LEFT  JOIN  product_versions    AS pv ON pv.version_id   = cp.version_id",
						"    LEFT  JOIN  products            AS pd ON pd.product_id   = pv.product_id",
						"    WHERE       ct.status_id        IN      (1,2,3,4,5,6,7)",
						"    AND         ct.navision_code    IS NOT  NULL",
						"    GROUP BY    ct.client_id",
						")   AS S",
						":TERMS:",
						"ORDER BY S.cid :LIMIT: :PAGE:",
					],
					Params: {
						Terms: {
							Default: '',
							Format 	(cls) {
								var opr = cls.terms.has('"') ? 'REGEXP BINARY' : 'REGEXP';
								return SQL.CLAUSE('S.search', opr,
									SQL.BRKT(SQL.LIST(
										[	  cls.terms, cls.terms, cls.terms, cls.terms, cls.terms
										], [
											{ split: ORS, equals:  true, join: PIP , match: /^\d+$/ },
											{ split: ORS, equals:  true, join: PIP , match: /^C\d{5,}$/ },
											{ split: ORS, equals:  true, join: PIP , match: /^\[[^{\[\]}]+\]$/ },
											{ split: ORS, equals: false, join: PIP , match: /^([{\[].*[\]}]|C?\d+|[\d.]+)$/ },
											{ split: ORS, equals:  true, join: PIP , match: /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/ },
											{ split: ORS, equals:  true, join: PIP , match: /^[A-Z0-9]{2,3}$/ }
										], [
											{ none: '', add: '', insert: "^(%s)<" 						},
											{ none: '', add: '', insert: ".*<(%s)>.*" 					},
											{ none: '', add: '', insert: "^((?!%s).)*" 					},
											{ none: '', add: '', insert: ".*<((%s))>.*" 				},
											{ none: '', add: '', insert: ".*<%%(%s)%%>$" 				},
											{ none: '', add: '', insert: ".*<(%s)>.*" 					}
										], [  null, null,
											mtch => { return ''; },
											mtch => {
												var rslt = 	mtch.replace(/("[^"]+"|[^"]+)/g, "$1\n")
																.replace(/"{2,}/g, "").split('\n');
												// ---
												return 	rslt.map((chnk, c) => {
													chnk = 	chnk.replace(/^(\w+)[_-](\w+)$/, "$1__HYPH__$2")
																.replace(/([()])/g, "\\$1");
													return 	(!!chnk.match(/^"(.*)"$/) ?
															   chnk.replace(/"(.+)"/g, "[[:<:]]$1[[:>:]]") :
															   chnk.replace(/([^A-Za-z0-9\[\]_-]+)/g, ".*")
														    ).replace(/__HYPH__/g, '[_-]');
												}).join('')
												.replace(/^([^"].*[^"]*)$/, "[^<>%]*$1[^<>%]*")
												.replace(/^(.*\.\*.*)$/, "($1)");
											},
											mtch => { return TLS.IP2Lng(mtch); },
											null
									]), ["'","'"], PIP), "WHERE"
								);
							},
							Desc: 	{
								type: { List: "Text", Separator: ORS }, to: 'param',
								description: "A semi-colon-separated list of search terms", required: true,
								matches: {
									'Client ID     ': 'Matches ONE of the Search Terms (([0-9]+))',
									'Client Text ID': 'Matches ANY {{STRING}} Search Term  (([A-Za-z0-9-_]+))',
									'Hotel Code    ': 'Matches ONE of the Search Terms (([A-Za-z0-9-_]+))',
									'Navision Code ': 'Matches ONE of the Search Terms ((C[0-9]{5,}))',
									'Client Name   ': 'Matches ANY {{STRING}} Search Term  (([A-Za-z0-9 ()]+))',
									'Brand Name    ': 'Matches ANY {{STRING}} Search Term  (([A-Za-z0-9 ,-]+))',
									'IP Address    ': 'Matches ANY {{IP}} Search Term (([1-][0-9]{,2}(.[0-9]{1,3}){3}))',
									'Product(s)    ': 'Matches ANY {{STRING}} Search Term (([A-Z0-9]{2,3}))',
								}
							}
						},
						By: {
							Default: 'CID',
							Format  (cls) { return 'S.'+cls.by.toLowerCase(); },
							Desc: 	{ to: 'query',
								type: 'text', description: 'The key to group the results by', required: false,
								matches: {
									'Client ID     ': 'CID',
									'Client Text ID': 'TID',
									'Hotel Code    ': 'HID',
									'Navision Code ': 'NID',
									'Client Name   ': 'Name',
								}
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[ ['hotels', 'S.cid'], ],
					Parse  	(res) {
						var RQ  = this.RQ, Path = this.Path, ret = {}, key, lnk, ids,
							lqy = '?as=list&to=["payload","result","', lpm = ':cids:',
							rgx = { 'cid': '\\\\d+', 'tid': '\\\\w+', 'hid': '\\\\w+',
									'nid': '[A-Z]\\\\d+', 'name': '\\\\w+' };
						res.map((ls, l) => {
							if (!!!key) { key = Object.keys(ls)[0]; }
							var lid = ls[key]; delete ls[key]; ret[lid] = ls.info;
						}); console.log('KEY:', key)
						if (ids = JSN.KV(ret).K.join(ORS), ids) {
							lnk = lpm+ids+lqy+rgx[key]
							RQ.links.hotels 	= SQL.SOCKET({ link:   '/hotels/'+lnk+'"]'  			});
							RQ.links.products 	= SQL.SOCKET({ link: '/products/'+lnk+'","products"]' 	});
							RQ.links.network 	= SQL.SOCKET({ link:  '/network/'+lnk+'","network"]'  	});
						}; 	return ret;
					},
					Key: 'cid',
				},
			},
			Errors: 	{ BAD_REQ: ['/'] }
		},
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Hotels: 	{
			Actions: 	{
				// ======================================================================
				Serial: {
					Scheme: '/:serial([A-Za-z0-9;]+)/',
					Sub: null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:serial:JNFXFX1": "Displays the result whose {{Server Serial}} is 'JNFXFX1'",
							"?page=2&limit=1": "Displays the 'second' {{Page}} page of all results at a {{Limit}} of 'one' result per {{Page}}",
						},
					},
					Query: 	[
						"SELECT C.tid, C.name, C.brand,",
						"       "+SQL.SOCKET({link:'/products/:cids:%s', columns:['C.cid']})+" AS products,",
						"       "+SQL.SOCKET({link:'/network/:cids:%s',  columns:['C.cid']})+" AS network,",
						"       C.live, C.nid, C.hid, C.cid, C.sid",
						"FROM   (",
						"       SELECT      ct.client_text_id AS tid, ct.client_name AS name,",
						"                   b.brand_name AS brand, ct.live_date AS live, ct.status_id AS sid,",
						"                   ct.navision_code AS nid, ct.hotel_code AS hid, ct.client_id AS cid",
						"       FROM        clients AS ct",
						"       INNER JOIN  client_brands       AS b ON ct.brand_id = b.brand_id",
						"       WHERE       ct.status_id        IN      (1,2,3,4,5,6,7)",
						"       AND         ct.navision_code    IS NOT  NULL",
						"       AND         ct.client_id IN (",
						"           SELECT      e.client_id ",
						"           FROM        omd_device           AS e",
						"           LEFT  JOIN  omd_device_mgmt_info AS m ON e.device_id  = m.device_id",
						"           WHERE       m.serial_number IN :SERIAL:",
						"       )",
						"       ORDER BY    ct.client_id",
						// "        ORDER BY ct.status_id DESC, UNIX_TIMESTAMP(ct.live_date) DESC",
						"       :LIMIT: :PAGE:",
						")  AS C",
					],
					Params: {
						Serial: {
							Default: '',
							Format 	(cls) {
								return SQL.BRKT(SQL.LIST([cls.serial],
									[{ split: ORS, match: /^[A-Za-z0-9]+$/, equals: true, join: '","' }]),
								['("','")'], PIP);
							},
							Desc: 	{
								type: { List: "Text", Separator: ORS }, to: 'param',
								description: "The Serial Number of a Hotel's Device", required: true,
								matches: { 'Serial': 'Matches a {{Server Serial}} (([A-Za-z0-9]+))' },
							}
						}, Page: true, Limit: true, ID: true
					},
					Links: 	[
						['products', 'C.cid'],
						['network', 'C.cid'],
						['hotels', 'details', 'C.cid'],
					],
					Key: 	'cid',
				},
				// ======================================================================
				"/": {
					Scheme: '/:cids([0-9;]+)?/',
					Sub: null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:cids:123": "Displays the result whose {{Client ID}} is '123'",
							"?page=2&limit=1": "Displays the 'second' {{Page}} page of all results at a {{Limit}} of 'one' result per {{Page}}",
						},
					},
					Query: 	[
						"SELECT C.tid, C.name, C.brand,",
						"		"+SQL.SOCKET({link:'/products/:cids:%s', columns:['C.cid']})+" AS products,",
						"		"+SQL.SOCKET({link:'/network/:cids:%s',  columns:['C.cid']})+" AS network,",
						"		C.live, C.nid, C.hid, C.cid, C.sid",
						"FROM 	(",
						"		SELECT 		ct.client_text_id AS tid, ct.client_name AS name,",
						"					b.brand_name AS brand, ct.live_date AS live, ct.status_id AS sid,",
						"					ct.navision_code AS nid, ct.hotel_code AS hid, ct.client_id AS cid",
						"		FROM        clients AS ct",
						"		INNER JOIN 	client_brands 		AS b ON ct.brand_id = b.brand_id",
						"		WHERE		ct.status_id 		IN 		(1,2,3,4,5,6,7)",
						"		AND 		ct.navision_code	IS NOT	NULL :CIDS:",
						"		ORDER BY 	ct.client_id",
						// "		ORDER BY ct.status_id DESC, UNIX_TIMESTAMP(ct.live_date) DESC",
						"		:LIMIT: :PAGE:",
						")	AS C",
					],
					Params: {
						CIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("ct.client_id", "IN", SQL.BRKT(
									SQL.LIST([cls.cids], [{ split: ORS, match: /^\d+$/, equals: true, join: ',' }]),
									["(",")"], PIP),
								"AND");
							},
							Desc: 	{ to: 'param',
								type: 'Number', description: 'The numeric ID of the Hotel', required: false,
								matches: { 'Client ID': 'Matches the {{CID}} (([0-9]+))' },
							}
						}, Page: true, Limit: true, ID: true
					},
					Links: 	[
						['products', 'C.cid'],
						['network', 'C.cid'],
						['hotels', 'details', 'C.cid'],
					],
					Key: 	'cid',
				},
			},
			Errors: 	{}
		},
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Products: 	{
			Actions: 	{
				"/": {
					Scheme: '/:cids((?:[0-9]+;?)+)?/',
					Sub: null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"?page=1&limit=10": "Displays the 'first' {{Page}} at a {{Limit}} of 'ten' {{Products}} results per {{Page}}",
							"/:cids:3;23?page=2&limit=1": "Displays the 'second' {{Page}} of results at a {{Limit}} of 'one' per {{Page}}",
							"/:cids:477;325": "Displays the {{Products}} with an {{Client ID}} of '477' {{or}} '325'; respectively",
							"?types=OVM;RDV/" : "Displays the {{Products}} of {{Clients}} with a {{Product Type}} of 'OVM' {{or}} 'RDV'",
							"?types=OVM+RDV&show=RDV" : "Displays the {{RDV Product}} of {{Clients}} with a {{Product Type}} of 'OVM' {{and}} 'RDV'",
						},
					},
					Query: 	[
						"SELECT pr.cid, pr.products",
                        "FROM   (",
                        "   SELECT P.cid, CAST(CONCAT('{', GROUP_CONCAT(P.product ORDER BY P.pid SEPARATOR ','), '}') AS CHAR(1000)) AS products",
                        "   FROM    (",
                        "       SELECT V.cid, V.pid, V.name,",
                        "           CONCAT('\"', V.name, '\":{',",
                        "                '\"name\":\"',    V.fullname, '\"',",
                        "               ',\"version\":\"', V.version, '\"',",
                        "               (CASE WHEN V.ip > 0 THEN CONCAT(',\"ip\":',        V.ip) ELSE \"\" END),",
                        "               (CASE WHEN V.ip > 0 THEN CONCAT(',\"pass\":\"',    V.pass, '\"') ELSE \"\" END),",
                        "               (CASE WHEN V.ip > 0 THEN CONCAT(',\"link\":\"<T:', V.name,',U:ssh://',V.ip,':',V.port,':root:',V.pass,'/>\"') ELSE \"\" END),",
                        "           ' }') AS product",
                        "       FROM    (",
                        "           SELECT      i.client_id AS cid, p.product_id AS pid, p.name, p.fullname, p.version, COALESCE(n.ip_server, '0') as ip,",
                        "                       COALESCE((CASE WHEN n.ip_server IS NULL THEN \"\" WHEN p.name = 'OVM' THEN v.ovm_password ELSE n.ssh_password END), 'dlc413_jx') as pass,",
                        "                       (CASE WHEN n.ip_server IS NULL THEN 0 WHEN p.name = 'OVM' THEN 5440 WHEN p.name IN ('GS','OVI','RDV','MVP') THEN 1111 ELSE 22 END) as port",
                        "           FROM        client_isp  AS i",
                        "           INNER JOIN  (",
                        "               SELECT L.* FROM (",
                        "                   SELECT  c.client_id, CONCAT('<',GROUP_CONCAT(pd.name ORDER BY pd.product_id SEPARATOR '><'),'>') AS types",
                        "                   FROM    (SELECT client_id, navision_code FROM clients WHERE status_id IN (1,2,3,4,5,6,7) :CIDS:) AS c",
                        "                   INNER JOIN      client_products         AS cp   ON c.client_id      = cp.client_id",
                        "                   INNER JOIN      product_versions        AS pv   ON pv.version_id    = cp.version_id",
                        "                   INNER JOIN      products                AS pd   ON pd.product_id    = pv.product_id",
                        "                   GROUP BY c.client_id",
                        "               ) AS L ",
                        "               WHERE true",
                        "               :TYPES:",
                        "               :LIMIT: :PAGE:",
                        "           ) AS l ON l.client_id = i.client_id",
                        "           LEFT JOIN   (",
                        "               SELECT  c.client_id, pd.name, pv.product_id, pv.version_id, pd.verbose_name AS fullname, pv.name AS version",
                        "               FROM    (SELECT client_id, navision_code FROM clients) AS c",
                        "               INNER JOIN  client_products     AS cp   ON c.client_id      = cp.client_id",
                        "               INNER JOIN  product_versions    AS pv   ON pv.version_id    = cp.version_id",
                        "               INNER JOIN  products            AS pd   ON pd.product_id    = pv.product_id",
                        "               :SHOW:",
                        "           ) AS p ON p.client_id = l.client_id",
                        "           LEFT JOIN   client_network_info AS n    ON n.client_isp_id   = i.client_isp_id AND n.product_id = p.product_id",
                        "           LEFT JOIN   client_ovm_summary  AS v    ON v.client_id       = i.client_id",
                        "       ) AS V",
                        "   ) AS P",
                        "   GROUP BY P.cid",
                        ")  AS pr",
					],
					Params: {
						CIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("AND client_id", "IN", SQL.BRKT(SQL.LIST([cls.cids],
									[{ split: ORS, match: /^\d+$/, equals: true, join: ',' }], null), ["(",")"])
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS },
								description: 'A semi-colon-separated list of {{Client IDs}}', to: 'param',
								required: false, matches: { 'Client ID': 'Matches ONE of the {{CID}} Items (([0-9]+))', },
							}
						},
						Types: {
							Default: '',
							Format 	(cls) {
								var val = 	(cls.types||'').replace(/\s/g,''),
									wch = 	(val.distinct(AMP,ORS)||ORS).split(''),
									qry = 	(txt, dlm, idx) => {
										var opr, div, rgx, sub, lst, ptn, whr, ret = '',
											prm = [txt.toUpperCase()], brk = [ ".*(<", ">).*" ];
										if (!!txt) {
											div = {}; mch = {};
											div = {  [AMP]: '>.*<', 		[ORS]: '>|<' 		}[dlm];
											mch = {  [AMP]: /^([A-Z]+)$/, 	[ORS]: /^[A-Z]+$/ 	}[dlm];
											rgx = { split: dlm, match: mch, equals: true, join: "','" };
											sub = ["SELECT CONCAT('%s', ",
														"GROUP_CONCAT(pc.name ORDER BY pc.product_id SEPARATOR '%s'), ",
													"'%s') FROM products AS pc %s",
											].join(' ');
											lst = SQL.BRKT(SQL.LIST(prm, rgx, null), ["('","')"]);
											ptn = SQL.CLAUSE("pc.name", "IN", lst, "WHERE");
											whr = SQL.BRKT([!!prm ? sub.format(brk[0], div, brk[1], ptn) : ''], ['(',')']);
											ret = SQL.CLAUSE("L.types", 'REGEXP', whr, !!!idx ? "AND" : "OR");
										}; return ret;
									};
								return wch.map((v,i) => { return qry(val, v, i); }).join(' ');
								/////////////////////////////////////////////////////////////////////////////////////////////////////
								// ALTERNATE
									// var val = (cls.types||'').replace(/[^A-Z;+]/g,''),
									// 	opr = cls.types.has('"') ? 'REGEXP BINARY' : 'REGEXP';
									// return 	/*SQL.CLAUSE(
									// 			"pr.types", opr, SQL.BRKT(SQL.LIST(
									// 				[	  val, val,
									// 				], [
									// 					{ split: ORS, equals:  true, join: PIP , match: /^[A-Z]+$/ },
									// 					{ split: ORS, equals:  true, join: PIP , match: /^([A-Z]+\+)+[A-Z]+$/ },
									// 				], [
									// 					{ none: '', add: '', insert: ".*<(%s)>.*" },
									// 					{ none: '', add: '', insert: ".*<%s>.*" },
									// 				], [  null, mch => { return mch .replace(/([+])/g, '>.*<'); }
									// 			]), ["'","'"], PIP), "WHERE"
									// 		) + */
									// 		SQL.CLAUSE(
									// 			"pr.types", opr, SQL.BRKT(SQL.LIST(
									// 				[ 	val 	],
									// 				[ { split: ORS, equals:  true, join: PIP , match: /^[A-Z]+$/ } ],
									// 				[ { none: '', add: '', insert: ".*<(%s)>.*" } ],
									// 				[ 	null 	]
									// 			), ["'","'"], PIP), "WHERE"
									// 		) +
									// 		SQL.CLAUSE(
									// 			"pr.types", opr, SQL.BRKT(SQL.LIST(
									// 				[	val, 	],
									// 				[ { split: ORS, equals:  true, join: PIP , match: /^([A-Z]+\+)+[A-Z]+$/ } ],
									// 				[ { none: '', add: '', insert: ".*<%s>.*" } ],
									// 				[ 	function (mch) { return mch .replace(/([+])/g, '>.*<'); } ]
									// 			), ["'","'"], PIP), "OR"
									// 		);
							},
							Desc: 	{
								type: { List: "Number", Separator: "; | +" }, required: false, to: 'query',
								description: 'A semi-colon or hyphen-separated list of {{[Product Type Names]}}',
								matches: { 'Product Type Names': 'Matches ANY {{;}} or ALL {{+}} of the {{Product Type Names}} (([A-Z]+))' },
							}
						},
						Show: {
							Default: '',
							Format  (cls) {
								return SQL.CLAUSE("WHERE pd.name", "IN", SQL.BRKT(SQL.LIST([(cls.show||'').toUpperCase()],
									[{ split: ORS, match: /^[A-Z]+$/, equals: true, join: "','" }], null), ["('","')"])
								);
							},
							Desc: {
								type: { List: "Text", Separator: ORS },
								description: "The {{Product Types}} to include in the Result",
								required: false, to: 'query', hidden: false
							}
						}, Page: true, Limit: true, ID: true
					},
					// Parse: 	function (res) {
					// 	ret = {}; res.map(function(ls, l) {
					// 		var lid = ls.cid; delete ls.cid; ret[lid] = ls.products;
					// 	}); return ret;
					// },
					Key: 'cid',
					Columns: { '/products': ['products'] },
				},
			},
			Errors: 	{}
		},
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Network: 	{
			Actions: 	{
				// ======================================================================
				Model: 		{
					Scheme: '/:mids([0-9;]+)?/',
					Sub: [],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:mids:657;21" : "Displays the {{Device Model}} with an {{Model ID}} of '657' {{or}} '21'; respectively",
						},
					},
					Query: 	[
						"SELECT m.device_type_id AS mid, m.vendor_name AS vendor, ",
						"		m.model, m.port_count as ports, ",
						"		CONCAT('{ \"', CONCAT_WS('\", \"', ",
						"			CONCAT_WS('\": \"', 'name', COALESCE(m.device_name_oid, '')), ",
						"			CONCAT_WS('\": \"', 'model', COALESCE(m.model_oid, '')), ",
						"			CONCAT_WS('\": \"', 'serial', COALESCE(m.serial_oid, '')), ",
						"			CONCAT_WS('\": \"', 'firmware', COALESCE(m.version_oid, '')), ",
						"			CONCAT_WS('\": \"', 'location', COALESCE(m.phys_location_oid, ''))",
						"		), '\" }') AS oids, ",
						"		m.eos_date AS eos, m.eol_date AS eol",
						"FROM 	(",
						"	SELECT t.*, v.vendor_name",
						"	FROM 		omd_device_type t",
						"	INNER JOIN 	omd_vendor v ON v.vendor_id = t.vendor_id",
						"	:MIDS:",
						") m",
						":LIMIT: :PAGE:",
					],
					Params: {
						MIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE t.device_type_id", "IN", SQL.BRKT(SQL.LIST([cls.mids],
									[{ split: ORS, match: /^\d+$/, equals: true, join: ',' }], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Model IDs}}',
								required: false, matches: { 'Model ID': 'Matches ONE of the {{MID}} Items (([0-9]+))' },
							}
						}, Page: true, Limit: true, ID: true
					},
					Key: 'mid',
				},
				// ======================================================================
				Stats: 		{
					Scheme: '/:dids([0-9;]+)?/',
					Sub: ['device'],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:dids:249;885" : "Displays the {{Device Stats}} with an {{Device ID}} of '249' {{or}} '885'; respectively",
						},
					},
					Query: 	[
						"SELECT 	e.device_id AS did, e.mode, ",
						"			CONCAT('{ \"', CONCAT_WS(', \"', ",
						"				CONCAT(CONCAT_WS('\": \"', 'date', COALESCE(e.date_installed, '')), '\"'), ",
						"				CONCAT_WS('\": ', 'by', COALESCE(e.created_by, 'null')) ",
						"			), ' }') AS created, ",
						"			CONCAT('{ \"', CONCAT_WS(', \"', ",
						"				CONCAT(CONCAT_WS('\": \"', 'date', COALESCE(e.date_modified, '')), '\"'), ",
						"				CONCAT_WS('\": ', 'by', COALESCE(e.modified_by, 'null')) ",
						"			), ' }') AS modified, ",
						"			IF(e.verified = 1, 'true', 'false') AS verified, ",
						"			COALESCE(e.per_affected, 0) AS affected",
						"FROM 		omd_device e",
						":DIDS: :LIMIT: :PAGE:",
					],
					Params: {
						DIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE e.device_id", "IN", SQL.BRKT(SQL.LIST([cls.dids],
									[{ split: ORS, match: /^\d+$/, equals: true, join: ',' }], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Device IDs}}',
								required: false, matches: { 'Device ID': 'Matches ONE of the {{DID}} Items (([0-9]+))' },
							}
						}, Page: true, Limit: true, ID: true
					},
					Routes: ['device'],
					Key: 	'did',
				},
				// ======================================================================
				Map: 		{
					Scheme: '/:dids([0-9;]+)/',
					Sub: ['device'],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:dids:57;41" : "Displays the {{Device Map}} with an {{Device ID}} of '57' {{or}} '41'; respectively",
						},
					},
					Query: 	[
						"SELECT 	m.device_id AS did,",
						"			m.forwarding_db_port_id  AS pid,",
						"			CONCAT('{ \"',",
						"				CONCAT_WS(', \"', ",
						"					CONCAT('type\": \"', r.relationship_desc, '\"'),",
						"					CONCAT('device\": \"/network/device/', m.map_to_device_id, '\"'),",
						"					CONCAT('Port\": ', COALESCE(m.map_to_device_id_port, 1)),",
						"					CONCAT('room\": ', m.map_to_room),",
						"					CONCAT('vlan\": ', m.vlans)",
						"			), ' }') AS link",
						"FROM 		ovi_device_port_mapping m",
						"INNER JOIN ovi_port_map_relationship r ON r.relationship_id = m.relationship_id ",
						":DIDS: ",
					],
					Params: {
						DIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE m.device_id", "IN", SQL.BRKT(SQL.LIST([cls.dids],
									[{ split: ORS, match: /^\d+$/, equals: true, join: ',' }], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Device IDs}}',
								required: true, matches: { 'Device ID': 'Matches ONE of the {{DID}} Items (([0-9]+))' },
							}
						}, Page: false, Limit: false,
					},
					Parse  	(res) {
						var Path = this.Path.bind(this), RQ = this.RQ,
							ret = {}, devices = [], models = [],
							NEW = {
								Device  	(ret, did) {
									if (!ret.hasOwnProperty(did)) ret[did] = {};
								},
								Link  		(ret, did, pid) {
									if (!ret[did].hasOwnProperty(pid)) ret[did][pid] = {};
								}
							},
							SET = {
								Count  		(ret, cid, cat, did, mid) {
									var res = ret[cid]; res.total++; res[cat].count++;
									models.indexOf(mid) < 0 && models.push(mid);
									devices.push(did);
								},
								Mapping  	(ret, rs) {
									var did = rs.did, pid = rs.pid;
									NEW.Device(ret, did);
									NEW.Link(ret, did, pid);
									ret[did][pid] = rs.link;
								}
							};
						res.map((rs, r) => { SET.Mapping(ret, rs) });
						return ret;
					},
					Routes: ['device'],
					Key: 	'did',
				},
				// ======================================================================
				Device: 	{
					Scheme: '/:dids([0-9;]+)?/',
					Sub: [],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:dids:289;291" : "Displays the {{Device}} with an {{Device ID}} of '289' or '291'; respectively",
						},
					},
					Query: 	[
						"SELECT     e.device_id AS did, e.client_id AS cid, ",
						"           e.device_type_id AS mid, e.device_name AS name, ",
						"           "+SQL.SOCKET({link:'/network/model/:mids:%s', 		 columns:['e.device_type_id']})+" AS model,",
						"           e.ip_address AS ip, e.mac_addr AS mac, ",
						"           COALESCE(m.serial_number, '') AS serial, ",
						"           CAST(e.phys_location AS CHAR) AS location,",
						"           COALESCE(e.firmware_version, '') AS firmware, ",
						// "			"+SQL.SOCKET({link:'/network/device/map/:dids:%s', 	 columns:['e.device_id']})+" AS map, ",
						"           "+SQL.SOCKET({link:'/network/device/stats/:dids:%s', columns:['e.device_id']})+" AS stats",
						"FROM        omd_device e",
						"INNER JOIN  omd_device_mgmt_info m ON m.device_id = e.device_id",
						":DIDS: :LIMIT: :PAGE:",
					],
					Params: {
						DIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE e.device_id", "IN", SQL.BRKT(SQL.LIST([cls.dids],
									[{ split: ORS, match: /^\d+$/, equals: true, join: ',' }], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Device IDs}}',
								required: false, matches: { 'Device ID': 'Matches ONE of the DID Items (([0-9]+))' },
							}
						}, Page: true, Limit: true, ID: true
					},
					Key: 	'did',
				},
				// ======================================================================
				Category: 	{
					Scheme: '/:cid([0-9]+)/:types((?:(?:[A-Za-z]|%20)+;?)+)/',
					Sub: [],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:cid:3/:types:Ethernet Switch" : "Displays the {{Device}} in the {{Device Category}}, 'Ethernet Switch', with an {{Client ID}} of '3'",
						},
					},
					Query: 	[
						"SELECT     e.client_id AS cid, CONCAT('<',c.category_name,'>') AS name, e.device_id AS did, ",
						"           CONCAT('{ ', ",
						"               CONCAT('\"mid\": ', e.device_type_id), ', \"', ",
						"               CONCAT_WS('\", \"',",
						"                   CONCAT('name\": \"', e.device_name), ",
						"                   CONCAT('device\": \"', ",
						"                       "+SQL.SOCKET({
													link:'/network/device/:dids:%s',
													columns:['e.device_id'],
													escapes: 2,
												}),
						"                   ) ",
						"           ), '\" }') AS device",
						"FROM       (",
						"       SELECT      l.client_id FROM clients l",
						"       INNER JOIN  (SELECT DISTINCT client_id FROM omd_device) d ON d.client_id = l.client_id",
						"       :CID: :LIMIT: :PAGE:",
						") h",
						"LEFT JOIN omd_device e ON e.client_id = h.client_id",
						"LEFT JOIN omd_device_type t ON t.device_type_id = e.device_type_id",
						"LEFT JOIN omd_device_category c ON c.device_category_id = t.device_category_id",
						":TYPES: "
					],
					Params: {
						CID: {
							Default: '',
							Format 	(cls) { return SQL.CLAUSE("l.client_id", "=", cls.cid, "WHERE"); },
							Desc: 	{
								type: "Number", to: 'param', description: 'A valid {{Client ID}}',
								required: true, matches: { 'Client ID': 'Matches the {{CID}} Item (([0-9]+))' },
							}
						},
						Types: {
							Default: '',
							Format 	(cls) {
								var prm = [cls.types], rgx = [{ split: ORS, match: /^[\w\s]+$/i, equals: true, join: "', '" }],
									lst = SQL.BRKT(SQL.LIST(prm, rgx, null), ["('","')"], PIP);
								return SQL.CLAUSE("c.category_name", "IN", lst, "WHERE");
							},
							Desc: 	{
								type: { List: "Text", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Device Category}}',
								required: true, matches: { 'Device Category': 'Matches ONE of the {{Category}} Items (([A-Za-z ]+))' },
							}
						}, 	Page: true, Limit: true, ID: true
					},
					Parse  	(res) {
						// var Path = this.Path.bind(this), RQ = this.RQ, QY = this.QY,
							// ret = {}, devices = [], models = [],
							// NEW = {
							// 	Client: 	function (dev, cid) {
							// 		if (!dev.hasOwnProperty(cid)) {
							// 			dev[cid] = { cid: cid, devices: {} };
							// 		}
							// 	},
							// 	Category: 	function (dev, cid, cat) {
							// 		var res = dev[cid].devices;
							// 		if (!res.hasOwnProperty(cat)) res[cat] = {};
							// 	}
							// },
							// SET = {
							// 	Count: 		function (dev, cid, did, mid) {
							// 		var res = dev[cid];
							// 		models.indexOf(mid) < 0 && models.push(mid);
							// 		devices.push(did);
							// 	},
							// 	Device: 	function (dev, rs) {
							// 		var cid = rs.cid, did = rs.did, cat = rs.cat, mid = rs.device.mid;
							// 		NEW.Client(dev, cid);
							// 		NEW.Category(dev, cid, cat);
							// 		SET.Count(dev, cid, did, mid);
							// 		dev[cid].devices[cat][did] = rs.device;
							// 	}
							// };
							// res.map((rs, r) => { SET.Device(ret, rs) });
							// // try {
							// // 	RQ.links.models	 = Path(	 'model',  models.join(ORS));
							// // 	RQ.links.devices = Path(	'device', devices.join(ORS));
							// // 	RQ.links.maps 	 = Path('device/map', devices.join(ORS));
							// // } catch (e) {
							// // 	console.trace(e);
							// // }
							// return JSN.Objectify(Imm.Map(ret).toArray(), RQ.Key, RQ.Columns, QY);

						var Path = this.Path.bind(this), RQ = this.RQ, QY = this.QY, ret;
						// console.log(res)
						try {
							// console.log(res.constructor.name)
							ret  =  res .map(function mapRows (v,k) { return Assign({}, v); })
							// console.log(ret)
							ret  = 	Imm	.fromJS(ret).toMap()
										.groupBy((v,k) => { return v.get('cid'); })
										.map((v,k) => {
										    var grp = v.groupBy((v,k) => { return v.get('name'); }), r = Imm.Map({});
										    grp.map((v,k) => {
										        // console.log('\t', k)
										        r = r.set(k, Imm.Map({}))
										        v.map((vv,kk) => {
										            // console.log('\t\t', kk, [k,vv.get('did')])
										            r = r.setIn([k,vv.get('did')], vv.get('device'));
										        })
										        // console.log('\t\t\t', r.toJS())
										    })
										    return Imm.Map({ cid: k, network: r });
										}).toList().toJS();

							// console.log(ret)
						} catch (e) { console.log(e.stack); }

						return JSN.Objectify(ret, RQ.Key, RQ.Columns, QY);
					},
					Key: 	'cid',
					Columns: {
						'/network': 		 ['network','<(\\w ?)+>'],
						'/network/category': ['network','<(\\w ?)+>'],
					},
				},
				// ======================================================================
				"/": 		{
					Scheme: '/(:cids([0-9;]+)?|:types((?:(?:[A-Za-z]|%20)+;?)+)?/:cids([0-9;]+)?)/',
					Sub: null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"?page=1&limit=10": "Displays the 'first' {{Page}} at a {{Limit}} of 'ten' {{Network}} items per Page",
							"/:cids:3;629?page=2&limit=1": "Displays the 'second' {{Page}} of results at a {{Limit}} of 'one' per {{Page}}",
							"/:cids:3;629": "Displays the {{Network}} with an {{Client ID}} of '3' or '629'; respectively",
							"/:types:Ethernet Switch/:cids:3;629" : "Displays the {{Device}} in the {{Device Category}}, 'Ethernet Switch', with an {{Client ID}} of '3' or '629'; respectively",
						},
					},
					Query: 	[
						// "SELECT 	e.client_id AS cid, c.category_name AS cat, e.device_id AS did, CONCAT('{ ', ",
							// "				CONCAT('\"mid\": ', e.device_type_id), ', \"', ",
							// "				CONCAT_WS('\", \"',",
							// "					CONCAT('name\": \"', e.device_name), ",
							// "					CONCAT('device\": \"', ",
							// "						"+SQL.SOCKET({
							// 							link:'/network/device/:dids:%s',
							// 							columns:['e.device_id'],
							// 							escapes: 2,
							// 						}),
							// "					) ",
							// "			), '\" }') AS device",
							// "FROM 		(",
							// "		SELECT 		l.client_id FROM clients l",
							// "		INNER JOIN	(SELECT DISTINCT client_id FROM omd_device) d ON d.client_id = l.client_id",
							// "		:CIDS: :LIMIT: :PAGE:",
							// ") h",
							// "LEFT JOIN omd_device e ON e.client_id = h.client_id",
							// "LEFT JOIN omd_device_type t ON t.device_type_id = e.device_type_id",
							// "LEFT JOIN omd_device_category c ON c.device_category_id = t.device_category_id",
							// ":TYPES: "

						"SELECT     e.client_id AS cid, CONCAT('<',c.category_name,'>') AS name, ",
						"           "+SQL.SOCKET({ link: {
											point: 	['network','category'],
											params: { cid: '%s', types: '%s' },
											query: 	{ as: 'list',
												at: ['payload','result','%s','network','<%s>'],
												to: ['payload','result','%s','network','<%s>']
											},
										},
										columns:['e.client_id','c.category_name','e.client_id','c.category_name','e.client_id','c.category_name'],
										escapes: 2
									})+"   AS devices",
						"FROM        (",
						"        SELECT      l.client_id FROM clients l",
						"        INNER JOIN  (SELECT DISTINCT client_id FROM omd_device) d ON d.client_id = l.client_id",
						"        :CIDS: :LIMIT: :PAGE:",
						") h",
						"LEFT JOIN   omd_device e ON e.client_id = h.client_id",
						"LEFT JOIN   omd_device_type t ON t.device_type_id = e.device_type_id",
						"LEFT JOIN   omd_device_category c ON c.device_category_id = t.device_category_id",
						":TYPES:",
						"GROUP BY    c.category_name",
						"ORDER BY    c.category_group_id, c.device_category_id",
					],
					Params: {
						Types: {
							Default: '',
							Format 	(cls) {
								console.log(cls)
								var prm = [cls.types], rgx = [{ split: ORS, match: /^[\w\s]+$/i, equals: true, join: "', '" }],
									lst = SQL.BRKT(SQL.LIST(prm, rgx, null), ["('","')"], PIP);
								return SQL.CLAUSE("c.category_name", "IN", lst, "WHERE");
							},
							Desc: 	{
								type: { List: "Text", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Device Category}}',
								required: "~", matches: { 'Device Category': 'Matches ONE of the {{Category}} Items (([A-Za-z ]+))' },
							}
						},
						CIDs: {
							Default: '',
							Format 	(cls) {
								var prm = [cls.cids], rgx = [{ split: ORS, match: /^\d+$/, equals: true, join: ',' }],
									lst = SQL.BRKT(SQL.LIST(prm, rgx, null), ["(",")"], ",");
								return SQL.CLAUSE("l.client_id", "IN", lst, "WHERE");
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Client IDs}}',
								required: "~", matches: { 'Client ID': 'Matches ONE of the {{CID}} Items (([0-9]+))' },
							}
						}, 	Page: true, Limit: true, ID: true
					},
					Parse  	(res) {
						// var Path = this.Path.bind(this), RQ = this.RQ, QY = this.QY,
							// ret = {}, devices = [], models = [],
							// NEW = {
							// 	Client: 	function (dev, cid) {
							// 		if (!dev.hasOwnProperty(cid)) {
							// 			dev[cid] = { cid: cid, network: {} };
							// 		}
							// 	},
							// 	Category: 	function (dev, cid, cat) {
							// 		var res = dev[cid].network;
							// 		if (!res.hasOwnProperty(cat)) res[cat] = {};
							// 	}
							// },
							// SET = {
							// 	Count: 		function (dev, cid, did, mid) {
							// 		var res = dev[cid];
							// 		models.indexOf(mid) < 0 && models.push(mid);
							// 		devices.push(did);
							// 	},
							// 	Device: 	function (dev, rs) {
							// 		var cid = rs.cid, did = rs.did, cat = rs.cat, mid = rs.device.mid;
							// 		NEW.Client(dev, cid);
							// 		NEW.Category(dev, cid, cat);
							// 		SET.Count(dev, cid, did, mid);
							// 		dev[cid].network[cat][did] = rs.device;
							// 	}
							// };
							// res.map((rs, r) => { SET.Device(ret, rs) });
							// try {
							// 	RQ.links.models	 = Path(	 'model',  models.join(ORS));
							// 	RQ.links.devices = Path(	'device', devices.join(ORS));
							// 	RQ.links.maps 	 = Path('device/map', devices.join(ORS));
							// } catch (e) {
							// 	console.trace(e);
							// }
							// // console.log(JSON.stringify(res,null,'  '))
							// // console.log(JSON.stringify(Imm.Map(ret).toArray(),null,'  '))
							// console.log(Imm.Map(ret).toArray())
							// return JSN.Objectify(Imm.Map(ret).toArray(), RQ.Key, RQ.Columns, QY);
							// // return ret;

						var Path = this.Path.bind(this), RQ = this.RQ, QY = this.QY, ret;
						// console.log(res)
						try {
							// console.log(res.constructor.name)
							ret  =  res .map(function mapRows (v,k) { return Assign({}, v); })
							ret  = 	Imm	.fromJS(ret).toMap()
										.groupBy(function groupByCID (v,k) { return v.get('cid'); })
										.map(function mapCategories (v,k) {
											// console.log('KEY:', k)
											return Imm.Map({ cid: k,
												network: v.groupBy(function groupByName (v,k) { return v.get('name'); })
												 		  .map(function mapDevices (v,k) { return v.first().get('devices'); })
											});
										}).toList().toJS();
							// console.log(ret)
						} catch (e) { console.log(e.stack); }

						return JSN.Objectify(ret, RQ.Key, RQ.Columns, QY);
					},
					Key: 'cid',
					Columns: { '/network': ['network'] },
				},
			},
			Errors: 	{ BAD_REQ: ['/','/device/map/'] }
		},
	};	};

/////////////////////////////////////////////////////////////////////////////////////////////
