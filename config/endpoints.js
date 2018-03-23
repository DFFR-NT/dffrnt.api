
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
	};	};

/////////////////////////////////////////////////////////////////////////////////////////////
