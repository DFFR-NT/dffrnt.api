
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
	module.exports = function () { return { // DO NOT CHANGE/REMOVE!!!
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Users: 		{
			Actions: 	{
				// ======================================================================
				"/": {
					Scheme: '/:account([\\w\\d_-]+)/',
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
						":LIMIT: :PAGE:"
					],
					Params: {
						Account: {
							Default: '',
							Format 	(cls) {
								return SQL.BRKT(SQL.LIST([cls.account],
									[{ split: ORS, match: /^[A-Za-z0-9_-]+$/, equals: true, join: '","' }]),
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
		Locale: 		{
			Actions: 	{
				// ======================================================================
				Country: {
					Scheme: '/:term([\\w\\d,;.-]+)/',
					Sub: 	['search'],
					Routes: ['search'],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:term:camer": "Searches for any {{Countries}} matching 'camer' (like 'Cameroon')",
							"?page=3": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
						},
					},
					Query: [
						"SELECT  S.value, S.label",
						"FROM    (",
						"    SELECT  s.id AS value, CONCAT_WS(', ',",
						"                COALESCE(NULLIF(s.city,   ''),NULL),",
						"                COALESCE(NULLIF(s.region, ''),NULL),",
						"                COALESCE(NULLIF(s.country,''),NULL)",
						"            ) AS label,",
						"            MATCH(s.country) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
						"            LENGTH(CONCAT(s.country)) AS length",
						"    FROM    search_locale s",
						"    WHERE   MATCH(s.country) AGAINST (':TERM:' IN BOOLEAN MODE)",
						"    LIMIT   1000",
						") AS S",
						"ORDER BY (S.score/S.length) DESC",
						":LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) {
								return cls.term.split(/,\s*/)
												.filter((v,i) => !!v).join(', ')
												.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
												.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
							},
							Desc: 	{
								type: "Text", to: 'param', required: true,
								description: "A {{Search Term}} for the {{Country}}",
								matches: {
									'Country': 	'Matches the {{Country}}, unless omitted (([A-z0-9,.-]+))',
								},
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[],
					Key: ''
				},
				// ======================================================================
				Region: {
					Scheme: '/:term([\\w\\d,;.-]+)/',
					Sub: 	['search'],
					Routes: ['search'],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:term:misiss": "Searches for any {{Regions}} matching 'misiss' (like 'Mississippi')",
							"?page=10": "Displays the 10th {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
						},
					},
					Query: [
						"SELECT  S.value, S.label",
						"FROM    (",
						"    SELECT  s.id AS value, CONCAT_WS(', ',",
						"                COALESCE(NULLIF(s.city,   ''),NULL),",
						"                COALESCE(NULLIF(s.region, ''),NULL),",
						"                COALESCE(NULLIF(s.country,''),NULL)",
						"            ) AS label,",
						"            MATCH(s.region) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
						"            LENGTH(CONCAT(s.region)) AS length",
						"    FROM    search_locale s",
						"    WHERE   MATCH(s.region) AGAINST (':TERM:' IN BOOLEAN MODE)",
						"    LIMIT   1000",
						") AS S",
						"ORDER BY (S.score/S.length) DESC",
						":LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) {
								return cls.term.split(/,\s*/)
												.filter((v,i) => !!v).join(', ')
												.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
												.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
							},
							Desc: 	{
								type: "Text", to: 'param', required: true,
								description: "A {{Search Term}} for the {{Region}}",
								matches: {
									'Region': 'Matches the {{Region}}, unless omitted (([A-z0-9,.-]+))',
								},
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[],
					Key: ''
				},
				// ======================================================================
				City: {
					Scheme: '/:term([\\w\\d,;.-]+)/',
					Sub: 	['search'],
					Routes: ['search'],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:term:calgar": "Searches for any {{Cities}} matching 'calgar' (like 'Calgary')",
							"?page=7": "Displays the 7th {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
						},
					},
					Query: [
						"SELECT  S.value, S.label",
						"FROM    (",
						"    SELECT  s.id AS value, CONCAT_WS(', ',",
						"                COALESCE(NULLIF(s.city,   ''),NULL),",
						"                COALESCE(NULLIF(s.region, ''),NULL),",
						"                COALESCE(NULLIF(s.country,''),NULL)",
						"            ) AS label,",
						"            MATCH(s.city) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
						"            LENGTH(CONCAT(s.city)) AS length",
						"    FROM    search_locale s",
						"    WHERE   MATCH(s.city) AGAINST (':TERM:' IN BOOLEAN MODE)",
						"    LIMIT   1000",
						") AS S",
						"ORDER BY (S.score/S.length) DESC",
						":LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) {
								LG.IF(cls);
								return cls.term.split(/,\s*/)
												.filter((v,i) => !!v).join(', ')
												.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
												.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
							},
							Desc: 	{
								type: "Text",
								to: 'param', required: true,
								description: "A {{Search Term}} for the {{City}}",
								matches: {
									'City': 'Matches the {{City}}, unless omitted (([A-z0-9,.-]+))',
								},
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[],
					Key: ''
				},
				// ======================================================================
				Province: {
					Scheme: '/:term([\\w\\d,;.-]+)/',
					Sub: 	['city'],
					Routes: ['city'],
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:term:calgar": "Searches for any {{Cities}} matching 'calgar' (like 'Calgary')",
							"?page=7": "Displays the 7th {{Page}} at a {{Limit}} of 'ten' {{Locales}} per {{Page}}",
						},
					},
					Query: [
						"SELECT  S.value, S.label",
						"FROM    (",
						"    SELECT  s.id AS value, CONCAT_WS(', ',",
						"                COALESCE(NULLIF(s.city,   ''),NULL),",
						"                COALESCE(NULLIF(s.region, ''),NULL),",
						"                COALESCE(NULLIF(s.country,''),NULL)",
						"            ) AS label,",
						"            MATCH(s.city) AGAINST (':TERM:' IN BOOLEAN MODE) AS score,",
						"            LENGTH(CONCAT(s.city)) AS length",
						"    FROM    search_locale s",
						"    WHERE   MATCH(s.city) AGAINST (':TERM:' IN BOOLEAN MODE)",
						"    LIMIT   1000",
						") AS S",
						"ORDER BY (S.score/S.length) DESC",
						":LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) {
								LG.IF(cls);
								return cls.term.split(/,\s*/)
												.filter((v,i) => !!v).join(', ')
												.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
												.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
							},
							Desc: 	{
								type: "Text",
								to: 'param', required: true,
								description: "A {{Search Term}} for the {{City}}",
								matches: {
									'City': 'Matches the {{City}}, unless omitted (([A-z0-9,.-]+))',
								},
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[],
					Key: ''
				},
				// ======================================================================
				Search: {
					Scheme: '/(:term([\\w\\d,;.-]+)(?:/:in((?:(?:city|region|country)(?=;|$))*))?)/',
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
						"SELECT  S.value, S.label",
						"FROM    (",
						"    SELECT  s.id AS value, CONCAT_WS(', ',",
						"                COALESCE(NULLIF(s.city,   ''),NULL),",
						"                COALESCE(NULLIF(s.region, ''),NULL),",
						"                COALESCE(NULLIF(s.country,''),NULL)",
						"            ) AS label,",
						"            :TERM: AS score,",
						"            LENGTH(CONCAT(:IN:)) AS length",
						"    FROM    search_locale s",
						"    WHERE   :TERM:",
						"    LIMIT   1000",
						") AS S",
						"ORDER BY (S.score/S.length) DESC",
						":LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) {
								let term  = cls.term.split(/,\s*/)
												.filter((v,i) => !!v).join(', ')
												.replace(/((?:\b\w+\b)(?!,))/g, '+$1*')
												.replace(/((?:\b\w+\b)(?=,))/g, '+$1');
								return `MATCH(:IN:) AGAINST ('${term}' IN BOOLEAN MODE)`;
							},
							Desc: 	{
								type: "Text",
								to: 'param', required: true,
								description: "A {{Search Term}} for the {{Locale}}",
								matches: {
									'City': 	'Matches the {{City}}, unless omitted (([A-z0-9,.-]+))',
									'Region': 	'Matches the {{Region}}, unless omitted (([A-z0-9,.-]+))',
									'Country': 	'Matches the {{Country}}, unless omitted (([A-z0-9,.-]+))',
								},
							}
						},
						In: {
							Default: 'city;region;country',
							Format 	(cls) {
								let rgx = /^(city|region|country)$/i, pfx = 's.';
								return SQL.BRKT(SQL.LIST([(cls.in||this.Default)],
									[{ split: ORS, match: rgx, equals: true, join: `,${pfx}` }]),
								[`${pfx}`,''], PIP).toLowerCase();
							},
							Desc: 	{
								type: { List: "Text", Separator: ORS },
								to: 'param', required: false,
								description: "The parts of the {{Locale}} that the search should search",
								matches: {
									'City': 	'Will search the {{City}} of the {{Locale}}',
									'Region': 	'Will search the {{Region}} of the {{Locale}}',
									'Country': 	'Will search the {{Country}} of the {{Locale}}',
								},
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[],
					Key: ''
				},
				// ======================================================================
				"/": {
					Scheme: '/:lids((?:\\d+)(?=;|$))?/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:lid:312844": "Displays the {{Locale}} at the {{LID}}, 312844 (Calgary, Alberta, Canada)",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Locales}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT s.id AS value, CONCAT_WS(', ',",
						"           COALESCE(NULLIF(s.city,   ''),NULL),",
						"           COALESCE(NULLIF(s.region, ''),NULL),",
						"           COALESCE(NULLIF(s.country,''),NULL)",
						"       ) AS label",
						"FROM   search_locale s",
						":LIDS: :LIMIT: :PAGE:",
					],
					Params: {
						LIDs: {
							Default: '',
							Format 	(cls) {
								console.log('CLS:', cls);
								return SQL.CLAUSE("WHERE  s.id", "IN", SQL.BRKT(
									SQL.LIST(cls.lids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Locale IDs}}',
								required: false, matches: { 'Locale ID': 'Matches ANY of the {{LID}} Items (([0-9]+))' },
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[]
				}
			},
			Errors: 	{ BAD_REQ: [
				'/',
				'/search/',
				'/search/city',
				'/search/region',
				'/search/country'
			] }
		},
	};	};

/////////////////////////////////////////////////////////////////////////////////////////////
