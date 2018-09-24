
module.exports = {
    Global:     { // RESERVED ~ !!!
        config:     {
            name:        'global',
            title:       'API Remoter',
            description: 'Server API Access',
            accessor:     false,
            page:         null,
        }, 
        expose:     [
            'accessor',
            'rest',
        ],
    },
    Accessor:   { // RESERVED ~ !!!
        config:     {
            name:        'accessor',
            title:       'API Authoriser',
            description: 'Granting Access',
            accessor:     true,
            page:         null,
        },
    },
    REST:       { // RESERVED ~ !!!
        config:     {
            name:        'rest',
            title:       'API Explorer',
            description: 'Querying Data',
            accessor:     false,
            page:        {
                title:      () => 'API Explorer',
                CSS:        ['explorer'],
                styles:      true,
                main:       'explorer',
                type:       'cover',
            },
        },
    },
    Static:     {
        config:     {
            name:        'static',
            scheme:      '/\\b(about|help|safety|privacy|terms)\\b/',
            title:       'Static Page',
            description: 'Displaying Static Pages',
            accessor:     false,
            page:        {
                title:      (path) => ({
                      '/about': 'About Us',
			           '/help': 'Help / FAQ',
			         '/safety': 'Safety Guidelines',
			        '/privacy': 'Privacy Policy',
			          '/terms': 'Term & Services',
                })[path],
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'stock',
            },
        },
    },
    Search:     {
        config:     {
            name:        'results',
            scheme:      '/results/',
            title:       'Search Results',
            description: 'Searching User & Providers',
            accessor:     false,
            page:        {
                title:      (path) => 'Search Results',
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'stock',
            },
        },
    },
    Profile:    {
        config:     {
            name:        'profile',
            scheme:      '/\\b(([\\w_-]|\.(?!html?|je?pg|png|pdf))+)\\b/',
            title:       'Profile Page',
            description: 'Displaying User Profiles',
            accessor:     false,
            page:        {
                title:      (path, usr) => `Profile | ${Object.values(((usr||{}).Profile||{}).Name||[]).join(' ')}`,
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'cover',
            },
        },
    },
};
