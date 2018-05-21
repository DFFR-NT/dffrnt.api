
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
		__DEFAULTS: {
			UID: {
				Default: '',
				Format 	(cls) { return cls.uid },
				Desc: 	{
					type: "Number", to: 'param',
					description: 'A valid {{User ID}}',
					required: true, matches: { 'USer ID': 'Matches the {{User ID}} (([0-9]+))' },
				}
			},
			UIDs: {
				Default: '',
				Format 	(cls) { return cls.uids.split(';').join(','); },
				Desc: 	{
					type: { List: "Number", Separator: ORS }, to: 'param',
					description: 'A semi-colon-separated list of valid {{User IDs}}',
					required: true, matches: { 'User ID': 'Matches ANY of the {{UID}} Items (([0-9]+))' },
				}
			},
		},
		// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		Users: 		{
			Actions: 	{
				// ======================================================================
				Languages: {
					Scheme: '/:uids(\\d+)/',
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:uid:14/:hid:1": "Returns the {{Users}} whose {{Hobbies}} match the {{HID}}, 1 in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT     u.user_fk AS user_id, CONCAT('[',",
						"           GROUP_CONCAT(JSON_OBJECT(",
						"               'value', CAST(l.language_id    AS CHAR(20)),",
						"               'label', l.language_name,",
						"               'level', e.language_level_code",
						"           ) SEPARATOR ','),']') as languages",
						"FROM       user_languages        AS u",
						"LEFT  JOIN user_visibilities     AS v ON u.user_fk        = v.user_fk AND :VISIBLE:",
						"INNER JOIN languages             AS l ON u.language_fk    = l.language_id",
						"INNER JOIN language_levels       AS e ON u.language_level = e.language_level_id",
						"WHERE      u.user_fk IN (:UIDS:)",
						"AND 		!(COALESCE(v.value,0) & 128)",
						"GROUP BY   u.user_fk",
						":LIMIT: :PAGE:",
					],
					Params: {
						UIDs: true,
						Visible: true, ID:    true, 
						Page:    true, Limit: true
					},
					Links: 	[],
					Key: 	'user_id',
				},
				// ======================================================================
				Hobbies: {
					Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:uid:14/:hid:1": "Returns the {{Users}} whose {{Hobbies}} match the {{HID}}, 1 in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT     u.user_fk AS user_id, CONCAT('[',",
						"           GROUP_CONCAT(JSON_OBJECT(",
						"               'value', CAST(h.hobby_id AS CHAR(20)),",
						"               'label', h.hobby_name,",
						"                'kind', h.hobby_type,",
						"                'more', EXISTS( SELECT * FROM hobbies b",
						"                                WHERE  b.hobby_name = h.hobby_name",
						"                                AND    b.hobby_id <> h.hobby_id),",
						"               'level', u.hobby_level",
						"           ) SEPARATOR ','),']') as hobbies",
						"FROM       user_hobbies      AS u",
						"LEFT  JOIN user_visibilities AS v ON u.user_fk  = v.user_fk AND :VISIBLE:",
						"INNER JOIN hobbies           AS h ON u.hobby_fk = h.hobby_id",
						"WHERE      u.user_fk IN (:UIDS:)",
						"AND        !(COALESCE(v.value,0) & 64)",
						"GROUP BY   u.user_fk",
						":LIMIT: :PAGE:",
					],
					Params: {
						UIDs: true,
						Visible: true, ID:    true, 
						Page:    true, Limit: true
					},
					Links: 	[],
					Key: 	'user_id',
				},
				// ======================================================================
				"/": {
					Scheme: '/:account([\\w\\d_;-]+)/',
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
						"SELECT     u.user_id, u.display_name,",
						"           JSON_OBJECT(",
						"               'first', getVis(v.value, 2, u.first_name),",
						"               'last',  getVis(v.value, 4, u.last_name)",
						"           ) AS name,",
						"           IF(v.value & 32, JSON_OBJECT(), JSON_OBJECT(",
						"               'id',    u.location,",
						"               'label', getLocale(l.city, l.region, l.country),",
						"               'codes', JSON_OBJECT(",
						"                   'region',  UPPER(r.code),",
						"                   'country', UPPER(f.code)",
						"           )))             AS location,",
						`           ${SQL.SOCKET({link:'/users/hobbies/:uids:%s',  columns:['u.user_id']})} AS hobbies,`,
						`           ${SQL.SOCKET({link:'/users/languages/:uids:%s',columns:['u.user_id']})} AS languages,`,
						"           JSON_OBJECT(",
						"               'verified',  u.verified, ",
						"               'status',    u.status, ",
						"               'tour_done', u.tour_done",
						"           ) AS checks,",
						"           getVis(v.value, 16, u.birth_date) AS birth_date,",
						"           u.inserted_at   AS member_since",
						"FROM       users           AS u",
						"LEFT  JOIN user_visibilities  v ON u.user_id = v.user_fk AND :VISIBLE:",
						"LEFT  JOIN search_locale   AS l ON u.location = l.id",
						"LEFT  JOIN regions         AS r ON r.id = l.region_id",
						"LEFT  JOIN countries       AS f ON f.id = r.country_id",
						"WHERE      u.display_name IN :ACCOUNT:",
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
						Single: true, Visible: true, ID: true, 
						Page:   true, Limit:   true
					},
					Links: 	[
						['products', 'C.cid'],
						['network', 'C.cid'],
						['hotels', 'details', 'C.cid'],
					],
					Parse  	(res) {
						var RQ  = this.RQ; if (!!eval(this.QY.single)) return res[0];
						return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
					},
					Key: 	'user_id',
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
		Hobbies: 		{
			Actions: 	{
				// ======================================================================
				Locale: {
					Scheme: '/(:uid(\\d+)(?:/:hids(\\d(?:[\\d;]+)))?)/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:uid:14/:hid:1": "Returns the {{Users}} whose {{Hobbies}} match the {{HID}}, 1 in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT     u.user_id, u.first_name, u.last_name, u.display_name, u.verified,",
						"           CONCAT_WS(', ',",
						"               COALESCE(NULLIF(l.city,   ''),NULL),",
						"               COALESCE(NULLIF(l.region, ''),NULL),",
						"               COALESCE(NULLIF(l.country,''),NULL)",
						"           ) AS location, p.profile_sex,",
						"           getAgeFromStr(u.birth_date) AS age,",
						"           CONCAT('[', ",
						"               GROUP_CONCAT(h.hobby_fk SEPARATOR ','),",
						"           ']') AS hobbies",
						"FROM 		(SELECT * FROM users",
						"            WHERE 	location =  (",
						"                SELECT location FROM users",
						"                WHERE  user_id = :UID:",
						"            ) AND user_id <> :UID:",
						"           ) AS u",
						"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
						"INNER JOIN search_locale        AS l ON u.location  = l.id",
						"INNER JOIN (SELECT *",
						"            FROM 	user_hobbies",
						"            :HIDS:",
						"           ) AS h ON u.user_id = h.user_fk",
						"GROUP BY   u.user_id",
						":LIMIT: :PAGE:",
					],
					Params: {
						UID: true, HIDs: {
							Default: '',
							Format 	(cls) {
								console.log(cls)
								return SQL.CLAUSE("WHERE  hobby_fk", "IN", SQL.BRKT(
									SQL.LIST(cls.hids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Hobby IDs}}',
								required: false, matches: { 'Hobby ID': 'Matches ANY of the {{Hobby ID}} Items (([0-9]+))' },
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[]
				},
				// ======================================================================
				Search: {
					Scheme: '/:term([\\w\\d,;.-]+)/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:term:basketball": "Displays the {{Hobbies}} with a {{Hobby Name}} matching 'basketball'",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Hobbies}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT   hobby_id   AS value,",
						"         hobby_name AS label,",
						"         hobby_type AS type",
						"FROM     hobbies",
						"WHERE    hobby_name LIKE ':TERM:'",
						"ORDER BY hobby_name :LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) { return `%${cls.term}%`; },
							Desc: 	{
								type: "Text",
								to: 'param', required: true,
								description: "A {{Search Term}} for the {{Hobby Name}}",
								matches: {
									'Hobby Name': 	'Matches the name of the {{Hobby}}, (([A-z0-9,.-]+))',
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
					Scheme: '/:hids((?:\\d+)(?=;|$))?/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:hid:3;4": "Returns the {{Hobby}} at the {{HIDs}}, 3 and 4",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Hobbies}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT   hobby_id   AS value,",
						"         hobby_name AS label,",
						"         hobby_type AS type",
						"FROM     hobbies",
						":HIDS: :LIMIT: :PAGE:",
					],
					Params: {
						HIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE  hobby_id", "IN", SQL.BRKT(
									SQL.LIST(cls.hids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Hobby IDs}}',
								required: false, matches: { 'Hobby ID': 'Matches ANY of the {{Hobby ID}} Items (([0-9]+))' },
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[]
				}
			},
			Errors: 	{ BAD_REQ: [
				'/',
				'/hobbies/',
			] }
		},
		Languages: 		{
			Actions: 	{
				// ======================================================================
				Locale: {
					Scheme: '/(:uid(\\d+)(?:/:lgids(\\d(?:[\\d;]+)))?)/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:uid:14/:lgid:1": "Returns the {{Users}} whose {{Languages}} match the {{LGID}}, 1 in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT     u.user_id, u.first_name, u.last_name, u.display_name, u.verified,",
						"           CONCAT_WS(', ',",
						"               COALESCE(NULLIF(l.city,   ''),NULL),",
						"               COALESCE(NULLIF(l.region, ''),NULL),",
						"               COALESCE(NULLIF(l.country,''),NULL)",
						"           ) AS location, p.profile_sex,",
						"           getAgeFromStr(u.birth_date) AS age,",
						"           CONCAT('[', ",
						"               GROUP_CONCAT(h.language_fk SEPARATOR ','),",
						"           ']') AS langauges",
						"FROM 		(SELECT * FROM users",
						"            WHERE 	location =  (",
						"                SELECT location FROM users",
						"                WHERE  user_id = :UID:",
						"            ) AND user_id <> :UID:",
						"           ) AS u",
						"INNER JOIN user_profile_details AS p ON u.user_id   = p.user_fk",
						"INNER JOIN search_locale        AS l ON u.location  = l.id",
						"INNER JOIN (SELECT *",
						"            FROM 	user_languages",
						"            :LGIDS:",
						"           ) AS h ON u.user_id = h.user_fk",
						"GROUP BY   u.user_id",
						":LIMIT: :PAGE:",
					],
					Params: {
						UID: true, LGIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE  language_fk", "IN", SQL.BRKT(
									SQL.LIST(cls.lgids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Language IDs}}',
								required: false, matches: { 'Language ID': 'Matches ANY of the {{Language ID}} Items (([0-9]+))' },
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[]
				},
				// ======================================================================
				Search: {
					Scheme: '/:term([\\w\\d,;.-]+)/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:term:basketball": "Displays the {{Languages}} with a {{Language Name}} matching 'basketball'",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Languages}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT   language_id   AS value,",
						"         language_name AS label",
						"FROM     languages",
						"WHERE    language_name LIKE ':TERM:'",
						"GROUP BY language_name",
						"ORDER BY language_name",
						":LIMIT: :PAGE:",
					],
					Params: {
						Term: {
							Default: '',
							Format 	(cls) { return `%${cls.term}%`; },
							Desc: 	{
								type: "Text",
								to: 'param', required: true,
								description: "A {{Search Term}} for the {{Language Name}}",
								matches: {
									'Language Name': 	'Matches the name of the {{Language}}, (([A-z0-9,.-]+))',
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
					Scheme: '/:lgids((?:\\d+)(?=;|$))?/',
					Sub: 	null,
					Doc: 	{
						Methods: 	Docs.Kinds.GET,
						Headers: 	{ token: Docs.Headers.Token },
						Examples: 	{
							"/:hid:3;4": "Returns the {{Language}} at the {{LGIDs}}, 3 and 4",
							"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Languages}} results per {{Page}}",
						},
					},
					Query: [
						"SELECT   language_id   AS value,",
						"         language_name AS label",
						"FROM     languages",
						":LGIDS: :LIMIT: :PAGE:",
					],
					Params: {
						LGIDs: {
							Default: '',
							Format 	(cls) {
								return SQL.CLAUSE("WHERE  language_id", "IN", SQL.BRKT(
									SQL.LIST(cls.lgids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null), ["(",")"], PIP)
								);
							},
							Desc: 	{
								type: { List: "Number", Separator: ORS }, to: 'param',
								description: 'A semi-colon-separated list of {{Language IDs}}',
								required: false, matches: { 'Language ID': 'Matches ANY of the {{Language ID}} Items (([0-9]+))' },
							}
						},
						Page: true, Limit: true, ID: true
					},
					Links: 	[]
				}
			},
			Errors: 	{ BAD_REQ: [
				'/',
				'/languages/',
			] }
		},
	};	};

/////////////////////////////////////////////////////////////////////////////////////////////
