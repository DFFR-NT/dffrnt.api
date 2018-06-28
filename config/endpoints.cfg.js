
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

	module.exports = function () { // DO NOT CHANGE/REMOVE!!!
		
		const rgnme = /^[a-z]+(?:-[a-z]+)?(?: (?:[sj]r.|[0-9](?:st|nd|rd|th)))?$/i
		const multi = function (param, name) { 
			return function Format(cls) {
				var regx = [/^\d+@\d+$/,/^\d+$/], 
					json = `d.profile_${name}`
					rslt = '', k = "'$.", d = `\n${'    '.dup(6)}`,
					edts = SQL.BRKT(SQL.LIST([cls[param]],
							[{ split: ORS, equals:  true, join: `,${k}`,  match: regx[0] }],
							[],[(m=>(s=m.split('@'),`${s[1]}',${s[0]}`))]
						),[`${k}`,""], ","), 
					rems = SQL.BRKT(SQL.LIST([cls[param]],
							[{ split: ORS, equals:  true, join: `',${k}`, match: regx[1] }],
							[],[]),[`${k}`,"'"], ",");
				rslt = (!!edts ? `JSON_SET(${d}\t${json},${d}    ${edts}${d})`: json);
				if (!!rems) rslt = `JSON_REMOVE(${rslt},${rems})`;				
				return rslt;
			}
		};
		
		return { 
			// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			__DEFAULTS: 	{
				UID: 		{
					Default: '0',
					Format 	(cls) { return cls.uid; },
					Desc: 	{
						type: "Number", to: 'param',
						description: 'A valid {{User ID}}',
						required: true, matches: { 'USer ID': 'Matches the {{User ID}} (([0-9]+))' },
					}
				},
				UIDs: 		{
					Default: '0',
					Format 	(cls) { return (cls.uids||'').toString().split(';').join(','); },
					Desc: 	{
						type: { List: "Number", Separator: ORS }, to: 'param',
						description: 'A semi-colon-separated list of valid {{User IDs}}',
						required: true, matches: { 'User ID': 'Matches ANY of the {{UID}} Items (([0-9]+))' },
					}
				},
				eImage: 	{
					Default: 'NULL',
					Format 	(cls) { return cls.image; },
					Desc: 	{
						type: "Number", to: 'query', required: true,
						description: "A valid {{Image}}",
						matches: {
							'Image': 'Matches the {{Image}} of the {{User}} (([A-z0-9_.-]+))'
						},
					}
				},
				eHIDs: 		{
					Default: '',
					Format: multi('ehids','hobbies'),
					Desc: 	{
						type: { List: "Text", Separator: ORS }, to: 'query', required: false,
						description: "The user's {{Hobby Edits}}", matches: {
							'Hobby Edits': 'Matches the {{Hobby Edits}} for the {{User}} (([0-9]+(?:@[0-9]+)?))'
						},
					}
				},
				eLIDs: 		{
					Default: '',
					Format: multi('elids','languages'),
					Desc: 	{
						type: { List: "Text", Separator: ORS }, to: 'query', required: false,
						description: "The user's {{Languages Edits}}", matches: {
							'Languages Edits': 'Updates the {{Languages Edits}} for the {{User}} (([0-9]+(?:@[0-9]+)?))'
						},
					}
				},
				eNIDs: 		{
					Default: '',
					Format(cls) {
						var regx = [/^\d+@[0-1]$/,/^\d+$/,/('\$\[[0-1]\]',\d+)/g], 
							prms = cls.enids.slice(0,2),
							rslt = '', k = "'$[", d = `\n${'    '.dup(6)}`,
							edts = (SQL.BRKT(SQL.LIST([prms],
									[{ split: ORS, equals: true, join: `,${k}`,  match: regx[0] }],
									[],[(m=>(s=m.split('@'),`${s[1]}]',${s[0]}`))]
									),[`${k}`,""], ",").match(regx[2])||[]).join(','), 
							rems = (SQL.BRKT(SQL.LIST([prms],
									[{ split: ORS, equals: true, join: `',${k}`, match: regx[1] }],
									[],[]),[`${k}`,"'"], ",").match(regx[2])||[]).join(',');
						rslt = (!!edts ? `JSON_SET(${d}\t${json},${d}    ${edts}${d})`: json);
						if (!!rems) rslt = `JSON_REMOVE(${rslt},${rems})`;				
						return rslt;
					},
					Desc: 	{
						type: { List: "Text", Separator: ORS }, to: 'query', required: false,
						description: "Up to 2 {{Nationalities Edits}}", matches: {
							'Nationalities Edits': 'Updates the {{Nationalities Edits}} for the {{User}} (([0-9]+(?:@[0-9]+)?))'
						},
					}
				},
				eRID: 		{
					Default: 'NULL',
					Format 	(cls) { return cls.rid; },
					Desc: 	{
						type: "Number", to: 'query', required: false,
						description: "The user's {{Religion ID}}",
						matches: {
							'Religion ID': 'Matches the {{Religion ID}} of the {{User}} (([0-9]+))'
						},
					}
				},
				eGID: 		{
					Default: 39,
					Format 	(cls) { return cls.gid; },
					Desc: 	{
						type: "Number", to: 'query', required: false,
						description: "The user's {{Gender ID}}",
						matches: {
							'Gender ID': 'Matches the {{Gender ID}} of the {{User}} (([0-9]+))'
						},
					}
				},
				eSex: 		{
					Default: 'NULL',
					Format 	(cls) { return (cls.sex.match(/^M|F|I$/)||[this.Default])[0]; },
					Desc: 	{
						type: "Text", to: 'query', required: false,
						description: "The user's {{Sex}}",
						matches: {
							'Sex': 'Matches the {{Sex}} of the {{User}} ((M|F|I))'
						},
					}
				},
				eMarital: 	{
					Default: 'NULL',
					Format 	(cls) { return (cls.marital.match(/^M|R|S$/)||[this.Default])[0]; },
					Desc: 	{
						type: "Text", to: 'query', required: false,
						description: "The user's {{Marital Status}}",
						matches: {
							'Marital Status': 'Matches the {{Marital Status}} of the {{User}} ((M|R|S))'
						},
					}
				},
				eDescr: 	{
					Default: '',
					Format 	(cls) { return cls.edescr; },
					Desc: 	{
						type: "Number", to: 'query', required: false,
						description: "The user's {{Description}}", matches: {
							'Description': 'Updates the {{Description}} of the {{User}} (([\S\s]+))'
						},
					}
				},
				eEdu: 		{
					Default: '',
					Format 	(cls) { return cls.eedu; },
					Desc: 	{
						type: "Number", to: 'query', required: false,
						description: "The user's {{Education}}", matches: {
							'Education': 'Updates the {{Education}} of the {{User}} (([\S\s]+))'
						},
					}
				},
				eEduDescr: 	{
					Default: '',
					Format 	(cls) { return cls.eedudescr; },
					Desc: 	{
						type: "Number", to: 'query', required: false,
						description: "The user's {{Education Description}}", matches: {
							'Education Description': 'Updates the {{Education Description}} of the {{User}} (([\S\s]+))'
						},
					}
				},
			},
			// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
			User: 			{
				Actions: 	{
					// ======================================================================
					Visibility: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Sub: 	['settings'],
						Routes: ['settings'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Visibiliy}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT    v.user_fk as user_id, JSON_OBJECT(",
							"              'id',      f.id,    'kind',  f.type,",
							"              'field',   f.field, 'name',  f.name,",
							"              'level',   f.level, 'value', f.value,",
							"              'follows', COALESCE(f.follows,''),",
							"              'status',  IF(v.value & f.value, 'true', 'false')",
							"          ) As visibility",
							"FROM      user_visibilities   v",
							"LEFT JOIN visibility_fields   f ON f.level > 1",
							"WHERE     v.user_fk IN (:UIDS:)",
							"ORDER BY  v.user_fk, f.id"
						],
						Params: { UIDs: true, Visible: true, ID: true },
						Links: 	[],
						Parse  	(res) {
							var RQ  =this.RQ,
								lst =Imm.fromJS(res.map(v=>Object.assign({},v))),
								ret =lst.toList()
										.groupBy(v=>v.get('user_id'))
										.map((v,k)=>Imm.Map({ 
											user_id: k, settings: { 
											visibility: v.map(l=>l.get('visibility'))
														.groupBy(v=>`$${v.get('field')}`)
														.map(l=>l.get(0).delete('field'))
										}	})  ).toList().toJS();
							return JSN.Objectify(ret, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					},
					// ======================================================================
					Settings: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Settings}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id, JSON_INSERT(",
							"               JSON_OBJECT(",
							"                   'email',      u.email_address,",
							"                   'timezone',   s.timezone,",
							"                   'language',   l.language_name,",
							`                   'visibility', ${SQL.SOCKET({link:'/user/settings/visibility/:uids:%s',columns:['u.user_id']})}`,
							"               ),",
							"               '$.modes',               JSON_OBJECT(),",
							"               '$.modes.admin',         s.is_admin,",
							"               '$.modes.transactional', s.is_transactional,",
							"               '$.modes.provider',      s.is_provider",
							"           ) AS settings",
							"FROM       users 			u",
							"INNER JOIN user_settings 	s ON u.user_id      = s.user_fk",
							"INNER JOIN languages       l ON s.language_id  = l.language_id",
							"WHERE      u.user_id IN (:UIDS:)",
							"GROUP BY   u.user_id :LIMIT: :PAGE:"

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
					Misc: {
						Scheme: '/:uids(\\d+)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Returns the {{Misc}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, IF(v.value & 8192, ",
							"               JSON_OBJECT('misc', JSON_OBJECT(",
							"           		'description', u.profile_description",
							"           	)),",
							"               JSON_INSERT(",
							"                   JSON_OBJECT('misc', JSON_OBJECT(",
							"               		'description', u.profile_description",
							"               	)), '$.misc.education', JSON_OBJECT(),",
							"               	'$.misc.education.institutions', u.profile_education,",
							"               	'$.misc.education.description',  u.profile_edu_descr",
							"           )) AS details",
							"FROM       user_profile_details  AS u",
							"LEFT  JOIN user_visibilities     AS v ON u.user_fk = v.user_fk AND :VISIBLE:",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:",
						],
						Params: {
							UIDs: true,
							Visible: true, ID:    true, 
							Page:    true, Limit: true
						},
						Links: 	[],
						Parse  	(res) {
							var RQ  = this.RQ, keys = Object.keys(res); 
							keys.map((k,i)=>{ 
								let det = JSON.parse(res[k].details),
									ins = det.misc.education.institutions;
								det.misc.education.institutions = ins.split(/\n|,\s+/g);
								res[k].details = det;
							});
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					},
					// ======================================================================
					Identity: {
						Scheme: '/:uids(\\d+)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Returns the {{Identity}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_SET(",
							"               JSON_OBJECT('identity', JSON_OBJECT(",
							"                   'sex','','gender',JSON_OBJECT('value','','label',''),'marital',''",
							"           	)   ),",
							"           	'$.identity.sex',          getVis(v.value, 2048, u.profile_sex),",
							"           	'$.identity.gender.value', getVis(v.value, 1024, CAST(g.gender_id AS CHAR(20))),",
							"           	'$.identity.gender.label', getVis(v.value, 1024, g.gender_name),",
							"           	'$.identity.marital',      getVis(v.value, 4096, u.profile_marital_status)",
							"           ) AS details",
							"FROM       user_profile_details  AS u",
							"LEFT  JOIN user_visibilities     AS v ON u.user_fk = v.user_fk AND :VISIBLE:",
							"INNER JOIN genders               AS g ON u.profile_identity = g.gender_id",
							"WHERE      u.user_fk IN (:UIDS:) :LIMIT: :PAGE:",
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
					Religion: {
						Scheme: '/:uids(\\d+)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Religion}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_SET(",
							"               JSON_OBJECT('religion', JSON_OBJECT('value',NULL,'label','')),",
							"           	'$.religion.value', CAST(r.religion_id AS CHAR(20)),",
							"           	'$.religion.label', r.religion_name",
							"           ) AS details",
							"FROM       user_profile_details  AS u",
							"LEFT  JOIN user_visibilities     AS v ON u.user_fk = v.user_fk AND :VISIBLE:",
							"INNER JOIN religions             AS r ON u.profile_religion = r.religion_id",
							"                                     AND !(COALESCE(v.value,0) & 512)",
							"WHERE      u.user_fk IN (:UIDS:) :LIMIT: :PAGE:",
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
					Nationalities: {
						Scheme: '/:uids(\\d+)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Nationalities}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, CONCAT('{\"nationalities\":[',",
							"           IF(n.nationality_id, GROUP_CONCAT(JSON_OBJECT(",
							"               'value', CAST(n.nationality_id AS INT),",
							"               'label', n.nationality_name",
							"           ) SEPARATOR ','),''),']}') as details",
							"FROM       user_profile_details AS u",
							"LEFT  JOIN user_visibilities    AS v ON u.user_fk  = v.user_fk AND true",
							"LEFT  JOIN nationalities        AS n ON !(COALESCE(v.value,0) & 256)",
							"                                    AND JSON_CONTAINS(",
							"                                         u.profile_nationalities,",
							"                                         n.nationality_id)",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:"
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
					Languages: {
						Scheme: '/:uids(\\d+)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Languages}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, CONCAT('{\"languages\":[',",
							"           IF(l.language_id, GROUP_CONCAT(JSON_OBJECT(",
							"               'value', CAST(l.language_id AS INT),",
							"               'label', l.language_name,",
							"               'level', CAST(JSON_VALUE(",
							"                    u.profile_languages, CONCAT('$.',l.language_id)",
							"                ) AS INT)",
							"           ) SEPARATOR ','),''),']}') as details",
							"FROM       user_profile_details AS u",
							"LEFT  JOIN user_visibilities    AS v ON u.user_fk  = v.user_fk AND true",
							"LEFT  JOIN languages            AS l ON !(COALESCE(v.value,0) & 128)",
							"                                    AND JSON_CONTAINS(",
							"                                            JSON_KEYS(u.profile_languages),",
							"                                            JSON_QUOTE(CONVERT(l.language_id,CHAR(5)",
							"                                        )))",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:",
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
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Hobbies}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, CONCAT('{\"hobbies\":[',",
							"           IF(h.hobby_id, GROUP_CONCAT(JSON_OBJECT(",
							"               'value', CAST(h.hobby_id AS INT),",
							"               'label', h.hobby_name,",
							"                'kind', h.hobby_type,",
							"                'more', EXISTS( SELECT * FROM hobbies b",
							"                                WHERE  b.hobby_name = h.hobby_name",
							"                                AND    b.hobby_id <> h.hobby_id),",
							"               'level', CAST(JSON_VALUE(",
							"                    u.profile_hobbies, CONCAT('$.',h.hobby_id)",
							"               ) AS INT)",
							"           ) SEPARATOR ','),''),']}') as details",
							"FROM       user_profile_details AS u",
							"LEFT  JOIN user_visibilities    AS v ON u.user_fk  = v.user_fk AND true",
							"LEFT  JOIN hobbies              AS h ON !(COALESCE(v.value,0) & 64)",
							"                                    AND JSON_CONTAINS(",
							"                                            JSON_KEYS(u.profile_hobbies),",
							"                                            JSON_QUOTE(CONVERT(h.hobby_id,CHAR(5)",
							"                                        )))",
							"WHERE      u.user_fk IN (:UIDS:)",
							"GROUP BY   u.user_fk :LIMIT: :PAGE:",
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
					Details: {
						Scheme: '/:uids(\\d(?:[\\d;]*\\d)?)/',
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Details}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_id, JSON_OBJECT(",
							`               'hobbies',       ${SQL.SOCKET({link:'/user/details/hobbies/:uids:%s',      columns:['u.user_id']})},`,
							`               'languages',     ${SQL.SOCKET({link:'/user/details/languages/:uids:%s',    columns:['u.user_id']})},`,
							`               'nationalities', ${SQL.SOCKET({link:'/user/details/nationalities/:uids:%s',columns:['u.user_id']})},`,
							`               'religion',      ${SQL.SOCKET({link:'/user/details/religion/:uids:%s',     columns:['u.user_id']})},`,
							`               'identity',      ${SQL.SOCKET({link:'/user/details/identity/:uids:%s',     columns:['u.user_id']})},`,
							`               'misc',          ${SQL.SOCKET({link:'/user/details/misc/:uids:%s',         columns:['u.user_id']})}`,
							"           ) AS details",
							"FROM       users     AS u",
							"WHERE      u.user_id IN (:UIDS:)",
							":LIMIT: :PAGE:"
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
					Photos: {
						Scheme: '/:uids(\\d+)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Returns the {{Images}} of the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT     u.user_fk AS user_id, JSON_OBJECT(",
							"               'profile', u.profile_picture,",
							"               'cover',   u.profile_cover",
							"           ) AS photos",
							"FROM       user_profile_details  AS u",
							"WHERE      u.user_fk IN (:UIDS:)",
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
							"           getVis(v.value, 1, u.email_address) AS email_address,",
							"           JSON_OBJECT(",
							"               'first', getVis(v.value, 2, u.first_name),",
							"               'last',  getVis(v.value, 4, u.last_name)",
							"           ) AS name,",
							`           ${SQL.SOCKET({link:'/user/photos/:uids:%s',		columns:['u.user_id']})} AS photos,`,
							"           IF(v.value & 32, JSON_OBJECT(), JSON_OBJECT(",
							"               'id',    u.location,",
							"               'label', getLocale(l.city, l.region, l.country),",
							"               'codes', JSON_OBJECT(",
							"                   'region',  UPPER(r.code),",
							"                   'country', UPPER(f.code)",
							"           )))             AS location,",
							"           JSON_OBJECT(",
							`               'hobbies',       ${SQL.SOCKET({link:'/user/details/hobbies/:uids:%s',      columns:['u.user_id']})},`,
							`               'languages',     ${SQL.SOCKET({link:'/user/details/languages/:uids:%s',    columns:['u.user_id']})},`,
							`               'nationalities', ${SQL.SOCKET({link:'/user/details/nationalities/:uids:%s',columns:['u.user_id']})},`,
							`               'religion',      ${SQL.SOCKET({link:'/user/details/religion/:uids:%s',     columns:['u.user_id']})},`,
							`               'identity',      ${SQL.SOCKET({link:'/user/details/identity/:uids:%s',     columns:['u.user_id']})},`,
							`               'misc',          ${SQL.SOCKET({link:'/user/details/misc/:uids:%s',         columns:['u.user_id']})}`,
							"           ) AS details,",
							`           ${SQL.SOCKET({link:'/provider/:uids:%s',     columns:['u.user_id']})} AS provider,`,
							`           ${SQL.SOCKET({link:'/user/settings/:uids:%s',columns:['u.user_id']})} AS settings,`,
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
						Links: 	[],
						Parse  	(res) {
							var lnk = ['hobbies','languages','nationalities','religion','identity','misc'],
								RQ  = this.RQ;
							// if (IDs = res.map((v,i)=>v.user_id), IDs) { 
								// var prm = `:uids:${IDs.join(';')}`;
								// lnk.map((l,i)=>{
								// 	var qry = `?as=item&&to=["payload","result"]`;
								// 	RQ.links[l]=SQL.SOCKET({link:`/user/${l}/${prm}${qry}`});
								// 	console.log(RQ.links[l])
								// });
							// };
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					}
				},
				Errors: 	{ BAD_REQ: ['/'] }
			},
			Update: 		{
				Actions: 	{
					// ======================================================================
					Visibility: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['settings'],
						Routes: ['settings'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Visibiliy}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE user_visibilities v",
							"SET    v.value   = COALESCE(NULLIF(:EVISIBLES:,-1), v.value)",
							"WHERE  v.user_fk = :UIDS:;",
							":/User/Visibility:"
						],
						Params: { 
							eVisibles: {
								Default: -1,
								Format 	(cls) { return (!NaN(cls.evisibles) ? cls.evisibles : this.Default); },
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Timezone}}",
									matches: {
										'Timezone': 'Updates the {{Timezone}} of the {{User}} ((M|R|S))'
									},
								}
							}, UIDs: true, Single: true 
						},
						Links: 	[],
						Parse  	(res) {
							var RQ  =this.RQ,
								lst =Imm.fromJS(res.map(v=>Object.assign({},v))),
								ret =lst.toList()
										.groupBy(v=>v.get('user_id'))
										.map((v,k)=>Imm.Map({ 
											user_id: k, settings: { 
											visibility: v.map(l=>l.get('visibility'))
														.groupBy(v=>`$${v.get('field')}`)
														.map(l=>l.get(0).delete('field'))
										}	})  ).toList().toJS();
							return JSN.Objectify(ret, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					},
					// ======================================================================
					Settings: {
						Scheme: '/:uids(\\d*)/',
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Settings}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_settings s SET",
							// "INNER JOIN users 	      u ON s.user_fk = u.user_id",
							// "           u.email_address    = COALESCE(NULLIF(':EEMAIL:',  ''), u.email_address),",
							"           s.timezone         = COALESCE(NULLIF(':ETZONE:',  ''), s.timezone),",
							"           s.language         = COALESCE(NULLIF( :ELANG:,    -1), s.language),",
							"           s.is_provider      = COALESCE(NULLIF( :EPROVIDER:,-1), s.is_provider),",
							"           s.is_transactional = COALESCE(NULLIF( :ETRANSACT:,-1), s.is_transactional)",
							"WHERE      s.user_fk IN (:UIDS:);",
							":/User/Settings:"
						],
						Params: { 
							// eEmail: {
								// Default: '',
								// Format 	(cls) { return ((cls.eemail||'').match(/^[\w_.-]+@[\w_.-]+\.[A-z]+$/)||[''])[0]; },
								// Desc: 	{
									// type: "Text", to: 'query', required: false,
									// description: "The user's {{Email Address}}",
									// matches: {
										// 'Email Address': 'Updates the {{Email Address}} of the {{User}} ((M|R|S))'
									// },
								// }
							// },
							eTZone: {
								Default: 'UTC',
								Format 	(cls) { 
									return cls.etzone; 
								},
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Timezone}}",
									matches: {
										'Timezone': 'Updates the {{Timezone}} of the {{User}} ((M|R|S))'
									},
								}
							},
							eLang: {
								Default: -1,
								Format 	(cls) { return (!NaN(cls.elang) ? cls.elang : this.Default); },
								Desc: 	{
									type: "Number", to: 'query', required: false,
									description: "The user's {{Site Language}}",
									matches: {
										'Site Language': 'Updates the {{Site Language}} of the {{User}} ((M|R|S))'
									},
								}
							},
							eProvider: {
								Default: -1,
								Format 	(cls) { return Number(Boolean(cls.eprovider||this.Default)); },
								Desc: 	{
									type: "Number", to: 'query', required: false,
									description: "The user's {{Provider Status}}",
									matches: {
										'Provider Status': 'Updates the {{Provider Status}} of the {{User}} ((0|1|true|false))'
									},
								}
							},
							eTransact: {
								Default: -1,
								Format 	(cls) { return Number(Boolean(cls.etransact||this.Default)); },
								Desc: 	{
									type: "Number", to: 'query', required: false,
									description: "The user's {{Transaction Status}}",
									matches: {
										'Transaction Status': 'Updates the {{Transaction Status}} of the {{User}} ((0|1|true|false))'
									},
								}
							}, UIDs: true, Single: true 
						},
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Education: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Misc}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_education = COALESCE(",
							"               NULLIF(':EEDU:',''),",
							"               d.profile_education),",
							"           d.profile_edu_descr = COALESCE(",
							"               NULLIF(':EEDUDESCR:',''),",
							"               d.profile_edu_descr)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Misc:"
						],
						Params: { eEdu: true, eEduDescr: true, UIDs: true, Single: true },
						Links: 	[],
						Parse  	(res) {
							var RQ  = this.RQ, keys = Object.keys(res); 
							keys.map((k,i)=>{ 
								let det = JSON.parse(res[k].details),
									ins = det.misc.education.institutions;
								det.misc.education.institutions = ins.split(/\n|,\s+/g);
								res[k].details = det;
							});
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					},
					// ======================================================================
					Description: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Misc}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_description = COALESCE(",
							"               NULLIF(':EDESCR:',''),",
							"               d.profile_description)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Misc:"
						],
						Params: {
							eDescr: true, UIDs: true, Single: true
						},
						Links: 	[],
						Parse  	(res) {
							var RQ  = this.RQ, keys = Object.keys(res); 
							keys.map((k,i)=>{ 
								let det = JSON.parse(res[k].details),
									ins = det.misc.education.institutions;
								det.misc.education.institutions = ins.split(/\n|,\s+/g);
								res[k].details = det;
							});
							return JSN.Objectify(res, RQ.Key, RQ.Columns, this.QY);
						},
						Key: 	'user_id',
					},
					// ======================================================================
					Marital: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Identity}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_marital_status = COALESCE(",
							"               NULLIF(':EMARTIAL:',''),",
							"               d.profile_marital_status)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Identity:"
						],
						Params: { eMarital: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Sex: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Identity}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_sex   = COALESCE(",
							"               NULLIF(':ESEX:',''),",
							"               d.profile_sex)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Identity:"
						],
						Params: { eSex: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Gender: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Identity}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"INNER JOIN genders               AS g ON g.gender_id = :EGID:",
							"SET        d.profile_identity = g.gender_id",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User/Identity:"
						],
						Params: { eGID: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Religion: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Religion}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"INNER JOIN religions             AS r ON r.religion_id = :ERID:",
							"SET        d.profile_religion =  r.religion_id",
							"WHERE      d.user_fk          IN (:UIDS:);",
							":/User/Religion:"
						],
						Params: { eRID: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},				
					// ======================================================================
					Nationalities: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Nationalities}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details AS u",
							"INNER JOIN (",
							"    SELECT     d.user_fk, CONCAT('[',",
							"                   GROUP_CONCAT(h.nationality_id SEPARATOR ',\"'),",
							"               ']') as nationalities",
							"    FROM       user_profile_details AS d",
							"    INNER JOIN (",
							"        SELECT     d.user_fk, JSON_COMPACT(",
							"                       :ENIDS:",
							"                   ) AS profile_nationalities",
							"        FROM       user_profile_details AS d",
							"        WHERE      d.user_fk IN (:UIDS:)",
							"    ) AS E ON d.user_fk = E.user_fk",
							"    LEFT  JOIN nationalities AS h ON ",
							"        JSON_CONTAINS(E.profile_nationalities,h.nationality_id)",
							"    GROUP BY   d.user_fk",
							") P ON u.user_fk = P.user_fk",
							"SET    u.profile_nationalities = P.nationalities",
							"WHERE  u.user_fk = P.user_fk;",
							":/User/Nationalities:"
						],
						Params: { eNIDs: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Languages: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Languages}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details AS u",
							"INNER JOIN (",
							"    SELECT     d.user_fk, CONCAT('{\"', GROUP_CONCAT(",
							"                   h.language_id, '\":', CAST(JSON_VALUE(",
							"                        E.profile_languages, CONCAT('$.',h.language_id)",
							"                   ) AS INT)",
							"               SEPARATOR ',\"'),'}') as languages",
							"    FROM       user_profile_details AS d",
							"    INNER JOIN (",
							"        SELECT     d.user_fk, JSON_COMPACT(",
							"                       :ELIDS:",
							"                   ) AS profile_languages",
							"        FROM       user_profile_details AS d",
							"        WHERE      d.user_fk IN (:UIDS:)",
							"    )                    AS E ON d.user_fk = E.user_fk",
							"    LEFT  JOIN languages AS h ON JSON_CONTAINS(",
							"                                     JSON_KEYS(E.profile_languages),",
							"                                     JSON_QUOTE(CONVERT(h.language_id,CHAR(5)",
							"                                 )))",
							"    GROUP BY   d.user_fk",
							") P ON u.user_fk = P.user_fk",
							"SET    u.profile_languages = P.languages",
							"WHERE  u.user_fk = P.user_fk;",
							":/User/Languages:;"
						],
						Params: { eLIDs: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Hobbies: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	['details'],
						Routes: ['details'],
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Hobbies}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details AS u",
							"INNER JOIN (",
							"    SELECT     d.user_fk, CONCAT('{\"', GROUP_CONCAT(",
							"                   h.hobby_id, '\":', CAST(JSON_VALUE(",
							"                        E.profile_hobbies, CONCAT('$.',h.hobby_id)",
							"                   ) AS INT)",
							"               SEPARATOR ',\"'),'}') as hobbies",
							"    FROM       user_profile_details AS d",
							"    INNER JOIN (",
							"        SELECT     d.user_fk, JSON_COMPACT(",
							"                       :EHIDS:",
							"                   ) AS profile_hobbies",
							"        FROM       user_profile_details AS d",
							"        WHERE      d.user_fk IN (:UIDS:)",
							"    )                  AS E ON d.user_fk = E.user_fk",
							"    LEFT  JOIN hobbies AS h ON JSON_CONTAINS(",
							"                                   JSON_KEYS(E.profile_hobbies),",
							"                                   JSON_QUOTE(CONVERT(h.hobby_id,CHAR(5)",
							"                               )))						  ",
							"    GROUP BY   d.user_fk",
							") P ON u.user_fk = P.user_fk",
							"SET    u.profile_hobbies = P.hobbies",
							"WHERE  u.user_fk = P.user_fk;",
							":/User/Hobbies:;"
						],
						Params: { eHIDs: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Details: {
						Scheme: '/:uids(\\d*)/',
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14": "Returns the {{Details}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							":/Update/Hobbies:;", 		":/Update/Languages:;",
							":/Update/Nationalities:;",	":/Update/Religion:;",
							":/Update/Sex:;",			":/Update/Marital:;",
							":/Update/Gender:;",		":/Update/Description:;",
							":/Update/Education:;",		":/User/Details:;",
						],
						Params: {
							eHIDs:		true, eLIDs:	true,
							eNIDs:		true, eRID:		true,
							eMarital: 	true, eSex: 	true,
							eGID: 		true, eEdu:		true, 
							eEduDescr:	true, eDescr:	true,
						},
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Cover: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Images}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_cover = COALESCE(",
							"               NULLIF(':EIMAGE:',''),",
							"               d.profile_cover)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User:"
						],
						Params: { eImage: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					Picture: {
						Scheme: '/:uids(\\d*)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{Images}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     user_profile_details  AS d",
							"SET        d.profile_picture = COALESCE(",
							"               NULLIF(':EIMAGE:',''),",
							"               d.profile_picture)",
							"WHERE      d.user_fk IN (:UIDS:);",
							":/User:"
						],
						Params: { eImage: true, UIDs: true, Single: true },
						Links: 	[],
						Key: 	'user_id',
					},
					// ======================================================================
					"/": {
						Scheme: '/:uids(\\d*)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.POST,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uids:14": "Updates the {{User Info}} of the {{User}} at the {{User ID}}, 14",
							},
						},
						Query: [
							"UPDATE     users         AS u",
							"LEFT  JOIN users         AS d ON d.user_id NOT IN (:UIDS:) AND d.display_name = 'EUSERNAME'",
							"LEFT  JOIN search_locale AS l ON l.id = :ELOCATION:",
							"SET        u.display_name = COALESCE(NULLIF(':EUSERNAME:', 'NULL',  d.display_name), u.display_name),",
							"           u.first_name   = COALESCE(NULLIF(':EFIRSTNAME:','NULL'), u.first_name),",
							"           u.last_name    = COALESCE(NULLIF(':ELASTNAME:', 'NULL'), u.last_name),",
							"           u.birt_hdate   = COALESCE(NULLIF(':EBIRTHDATE:','NULL'), u.birt_hdate),",
							"           u.location     = COALESCE(l.id, u.location)",
							"WHERE      u.user_id IN (:UIDS:);",
							":/User:"
						],
						Params: {
							eUserName: 	{
								Default: 'NULL',
								Format 	(cls) { return ((cls.eusername||'').match(/^[\w_.-]+$/)||[''])[0]; },
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Display Name}}", matches: {
										'Display Name': 'Updates the {{Display Name}} of the {{User}} (([\\w_.-]+))'
									},
								}
							},
							eFirstName: {
								Default: 'NULL',
								Format 	(cls) { return ((cls.efirstname||'').match(rgnme)||[''])[0].toTitleCase(); },
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{First Name}}", matches: {
										'First Name': `Updates the {{First Name}} of the {{User}} ((${rgnme.source}))`
									},
								}
							},
							eLastName: 	{
								Default: 'NULL',
								Format 	(cls) { return ((cls.elastname||'').match(rgnme)||[''])[0].toTitleCase(); },
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Last Name}}", matches: {
										'Last Name': `Updates the {{Last Name}} of the {{User}} ((${rgnme.source}))`
									},
								}
							},
							eBirthDate: {
								Default: 'NULL',
								Format 	(cls) { 
									let fyr = (new Date()).getFullYear(), mn = fyr-13, mx = fyr+120;
										rgx = RegExp('^(0\d|1[0-2])-([0-2]\d|3[0-1])-(\d{4})$'),
										dts = ((cls.elastname||'').match(rgx)||['']), yr;
									if (!!dts && dts.length == 4) {
										if (yr=Number(dts[3]), yr>=mn && yr<=mx) dts.shift();
										else dts = []; }; return dts.join('-'); 
								},
								Desc: 	{
									type: "Text", to: 'query', required: false,
									description: "The user's {{Birthdate}}", matches: {
										'Birthdate': 'Updates the {{Birthdate}} of the {{User}} ((\\d{2}-\\d{2}-\\d{4}))'
									},
								}
							},
							eLocation: 	{
								Default: -1,
								Format 	(cls) { return cls.elocation },
								Desc: 	{
									type: "Number", to: 'query', required: false,
									description: "The user's {{Location}}", matches: {
										'Location': 'Updates the {{Location}} of the {{User}} ((\\d{2}+))'
									},
								}
							}, UIDs: true, Single: true 
						},
						Links: 	[],
						Parse  	(res) {
							var lnk = ['hobbies','languages','nationalities','religion','identity','misc'],
								RQ  = this.RQ;
							// if (IDs = res.map((v,i)=>v.user_id), IDs) { 
								// var prm = `:uids:${IDs.join(';')}`;
								// lnk.map((l,i)=>{
								// 	var qry = `?as=item&&to=["payload","result"]`;
								// 	RQ.links[l]=SQL.SOCKET({link:`/user/${l}/${prm}${qry}`});
								// 	console.log(RQ.links[l])
								// });
							// };
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
							`SELECT     ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
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
								"/:uid:14/:lgid:1": "Returns the {{Users}} whose {{Languages}} match the {{LGID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							`SELECT     ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
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
			Religions: 		{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/(:uid(\\d+)(?:/:rids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14/:rid:1": "Returns the {{Users}} whose {{Religions}} match the {{RID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							`SELECT     ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM 		(SELECT * FROM users",
							"            WHERE 	location =  (",
							"                SELECT location FROM users",
							"                WHERE  user_id = :UID:",
							"            ) AND user_id <> :UID:",
							"           ) AS u",
							"INNER JOIN user_profile_details AS p ON u.user_id          =  p.user_fk",
							"                                    AND p.profile_religion IN (:RIDS:)",
							"INNER JOIN search_locale        AS l ON u.location         =  l.id",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: {
							UID: true, RIDs: {
								Default: '',
								Format 	(cls) {
									return SQL.LIST(cls.rids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null);
								},
								Desc: 	{
									type: { List: "Number", Separator: ORS }, to: 'param',
									description: 'A semi-colon-separated list of {{Religion IDs}}',
									required: false, matches: { 'Religion ID': 'Matches ANY of the {{Religion ID}} Items (([0-9]+))' },
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
								"/:term:islam": "Displays the {{Religions}} with a {{Religion Name}} matching 'islam'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Religions}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   religion_id   AS value,",
							"         religion_name AS label",
							"FROM     religions",
							"WHERE    religion_name LIKE ':TERM:'",
							":LIMIT: :PAGE:",
						],
						Params: {
							Term: {
								Default: '',
								Format 	(cls) { return `%${cls.term}%`; },
								Desc: 	{
									type: "Text",
									to: 'param', required: true,
									description: "A {{Search Term}} for the {{Religion Name}}",
									matches: {
										'Religion Name': 	'Matches the name of the {{Religion}}, (([A-z0-9,.-]+))',
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
						Scheme: '/:rids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Religion}} at the {{RIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Religions}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   religion_id   AS value,",
							"         religion_name AS label",
							"FROM     religions",
							":RIDS: :LIMIT: :PAGE:",
						],
						Params: {
							RIDs: {
								Default: '',
								Format 	(cls) {
									return SQL.CLAUSE("WHERE  religion_id", "IN", SQL.BRKT(
										SQL.LIST(cls.rids,[
											{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
										], null), ["(",")"], PIP)
									);
								},
								Desc: 	{
									type: { List: "Number", Separator: ORS }, to: 'param',
									description: 'A semi-colon-separated list of {{Religion IDs}}',
									required: false, matches: { 'Religion ID': 'Matches ANY of the {{Religion ID}} Items (([0-9]+))' },
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: [
					'/',
					'/religions/',
				] }
			},
			Genders: 		{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/(:uid(\\d+)(?:/:gids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14/:gid:1": "Returns the {{Users}} whose {{Genders}} match the {{GID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							`SELECT     ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM 		(SELECT * FROM users",
							"            WHERE 	location =  (",
							"                SELECT location FROM users",
							"                WHERE  user_id = :UID:",
							"            ) AND user_id <> :UID:",
							"           ) AS u",
							"INNER JOIN user_profile_details AS p ON u.user_id          =  p.user_fk",
							"                                    AND p.profile_identity IN (:GIDS:)",
							"INNER JOIN search_locale        AS l ON u.location         =  l.id",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: {
							UID: true, GIDs: {
								Default: '',
								Format 	(cls) {
									return SQL.LIST(cls.gids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null);
								},
								Desc: 	{
									type: { List: "Number", Separator: ORS }, to: 'param',
									description: 'A semi-colon-separated list of {{Gender IDs}}',
									required: false, matches: { 'Gender ID': 'Matches ANY of the {{Gender ID}} Items (([0-9]+))' },
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
								"/:term:cisgender": "Displays the {{Genders}} with a {{Gender Name}} matching 'cisgender'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Genders}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   gender_id          AS value,",
							"         gender_name        AS label,",
							"         gender_description AS description",
							"FROM     genders",
							"WHERE    gender_name LIKE ':TERM:'",
							":LIMIT: :PAGE:",
						],
						Params: {
							Term: {
								Default: '',
								Format 	(cls) { return `%${cls.term}%`; },
								Desc: 	{
									type: "Text",
									to: 'param', required: true,
									description: "A {{Search Term}} for the {{Gender Name}}",
									matches: {
										'Gender Name': 	'Matches the name of the {{Gender}}, (([A-z0-9,.-]+))',
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
						Scheme: '/:gids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Gender}} at the {{GIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Genders}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   gender_id          AS value,",
							"         gender_name        AS label,",
							"         gender_description AS description",
							"FROM     genders",
							":GIDS: :LIMIT: :PAGE:",
						],
						Params: {
							GIDs: {
								Default: '',
								Format 	(cls) {
									return SQL.CLAUSE("WHERE  gender_id", "IN", SQL.BRKT(
										SQL.LIST(cls.gids,[
											{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
										], null), ["(",")"], PIP)
									);
								},
								Desc: 	{
									type: { List: "Number", Separator: ORS }, to: 'param',
									description: 'A semi-colon-separated list of {{Gender IDs}}',
									required: false, matches: { 'Gender ID': 'Matches ANY of the {{Gender ID}} Items (([0-9]+))' },
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: [
					'/',
					'/genders/',
				] }
			},
			Nationalities: 	{
				Actions: 	{
					// ======================================================================
					Locale: {
						Scheme: '/(:uid(\\d+)(?:/:nids(\\d(?:[\\d;]+)))?)/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:uid:14/:nid:1": "Returns the {{Users}} whose {{Nationalities}} match the {{NID}}, 1, in the same {{Locale}} as the {{User}} at the {{User ID}}, 14",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Users}} results per {{Page}}",
							},
						},
						Query: [
							`SELECT     ${SQL.SOCKET({link:'/user/:uids:%s', columns:['u.user_id']})} AS user`,
							"FROM       (SELECT * FROM users",
							"            WHERE  location =  (",
							"                SELECT location FROM users",
							"                WHERE  user_id = :UID:",
							"            ) AND user_id <> :UID:",
							"           ) AS u",
							"INNER JOIN user_profile_details AS p ON u.user_id               =  p.user_fk",
							"                                    AND p.profile_nationality_1 IN (:NIDS:)",
							"                                     OR p.profile_nationality_2 IN (:NIDS:)",
							"INNER JOIN search_locale        AS l ON u.location              =  l.id",
							"GROUP BY   u.user_id",
							":LIMIT: :PAGE:",
						],
						Params: {
							UID: true, NIDs: {
								Default: '',
								Format 	(cls) {
									return SQL.LIST(cls.nids,[
										{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
									], null);
								},
								Desc: 	{
									type: { List: "Number", Separator: ORS }, to: 'param',
									description: 'A semi-colon-separated list of {{Nationality IDs}}',
									required: false, matches: { 'Nationality ID': 'Matches ANY of the {{Nationality ID}} Items (([0-9]+))' },
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
								"/:term:canadian": "Displays the {{Nationalities}} with a {{Nationality Name}} matching 'canadian'",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Nationalities}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   nationality_id          AS value,",
							"         nationality_name        AS label,",
							"         nationality_description AS description",
							"FROM     nationalities",
							"WHERE    nationality_name LIKE ':TERM:'",
							":LIMIT: :PAGE:",
						],
						Params: {
							Term: {
								Default: '',
								Format 	(cls) { return `%${cls.term}%`; },
								Desc: 	{
									type: "Text",
									to: 'param', required: true,
									description: "A {{Search Term}} for the {{Nationality Name}}",
									matches: {
										'Nationality Name': 	'Matches the name of the {{Nationality}}, (([A-z0-9,.-]+))',
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
						Scheme: '/:nids((?:\\d+)(?=;|$))?/',
						Sub: 	null,
						Doc: 	{
							Methods: 	Docs.Kinds.GET,
							Headers: 	{ token: Docs.Headers.Token },
							Examples: 	{
								"/:hid:3;4": "Returns the {{Nationality}} at the {{NIDs}}, 3 and 4",
								"?page=3&limit=10": "Displays the 3rd {{Page}} at a {{Limit}} of 'ten' {{Nationalities}} results per {{Page}}",
							},
						},
						Query: [
							"SELECT   nationality_id          AS value,",
							"         nationality_name        AS label,",
							"         nationality_description AS description",
							"FROM     nationalities",
							":NIDS: :LIMIT: :PAGE:",
						],
						Params: {
							NIDs: {
								Default: '',
								Format 	(cls) {
									return SQL.CLAUSE("WHERE  nationality_id", "IN", SQL.BRKT(
										SQL.LIST(cls.nids,[
											{ split: ORS, match: /^\d+$/, equals: true, join: ',' }
										], null), ["(",")"], PIP)
									);
								},
								Desc: 	{
									type: { List: "Number", Separator: ORS }, to: 'param',
									description: 'A semi-colon-separated list of {{Nationality IDs}}',
									required: false, matches: { 'Nationality ID': 'Matches ANY of the {{Nationality ID}} Items (([0-9]+))' },
								}
							},
							Page: true, Limit: true, ID: true
						},
						Links: 	[]
					}
				},
				Errors: 	{ BAD_REQ: [
					'/',
					'/nationalities/',
				] }
			},
		};	
	};

/////////////////////////////////////////////////////////////////////////////////////////////
