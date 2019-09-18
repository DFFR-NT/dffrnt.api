
module.exports = {
    PUSH:       [
        // { enc: 'Base64', path: '/public/images/Logo.footer.png' },
        // { enc: 'Base64', path: '/public/images/Logo.stock.png' },
        // { enc: 'utf8',   path: '/public/js/vendor.js' },
        // { enc: 'utf8',   path: '/public/js/engine.js' },
        // { enc: 'utf8',   path: '/public/comps/font-awesome/web-fonts-with-css/css/fontawesome-all.min.css' },
        // { enc: 'utf8',   path: '/public/css/style.css' },
        // { enc:  null,    path: '/public/comps/font-awesome/web-fonts-with-css/webfonts/fa-solid-900.woff2' },
        // { enc:  null,    path: '/public/comps/font-awesome/web-fonts-with-css/webfonts/fa-regular-400.woff2' },
        //     // { as: 'image', enc: 'Base64', mime: 'image/x-icon', path: '/public/images/icons/favicon.ico' },
    ],
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
        type:       'auth',
        config:     {
            name:        'accessor',
            title:       'API Authoriser',
            description: 'Granting Access',
            accessor:     true,
            page:         null,
        },
    },
    REST:       { // RESERVED ~ !!!
        type:       'rest',
        config:     {
            name:        'rest',
            title:       'API Explorer',
            description: 'Querying Data',
            accessor:     false,
            page:         null
        },
    },
    Error:      {
        type:       'page',
        config:     {
            name:        'error',
            scheme:      '/404/',
            title:       'Error Page',
            description: 'Displaying Errors',
            accessor:     false,
            restrict:    { true: null, false: null },
            page:        {
                title:      (path) => '404 Error',
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'jumbo',
            },
        },
    },
    Main:       {
        type:       'page',
        config:     {
            name:        'main',
            scheme:      '/\\b(home|log(in|out))\\b/',
            title:       'Main Page',
            description: 'Default Functionality',
            accessor:     false,
            restrict:    { true: 'profile', false: null },
            page:        {
                title:      (path) => ('Powered by People.'),
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'jumbo',
            },
        },
    },
    Static:     {
        type:       'page',
        config:     {
            name:        'static',
            scheme:      '/\\b(about|help|safety|privacy|terms)\\b/',
            title:       'Static Page',
            description: 'Displaying Static Pages',
            accessor:     false,
            restrict:    { true: null, false: null },
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
        type:       'page',
        config:     {
            name:        'results',
            scheme:      '/results/',
            title:       'Search Results',
            description: 'Searching User & Providers',
            accessor:     false,
            restrict:    { true: null, false: 'login' },
            page:        {
                title:      (path) => 'Search Results',
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'stock',
            },
        },
    },
    Defined:    {
        type:       'page',
        config:     {
            name:        'defined',
            scheme:      '/defined/',
            title:       'Defined Search',
            description: 'Defined Search',
            accessor:     false,
            restrict:    { true: null, false: 'login' },
            page:        {
                title:      (path) => 'Defined Search',
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'stock',
            },
        },
    },
    Settings:   {
        type:       'page',
        config:     {
            name:        'settings',
            scheme:      '/settings/',
            title:       'Settings Page',
            description: 'User Settings Access',
            accessor:     false,
            restrict:    { true: null, false: 'login' },
            page:        {
                title:      (path, usr) => `Settings | ${Object.values(((usr||{}).Profile||{}).Name||{}).join(' ')}`,
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'cover',
            },
        },
    },
    Update:     {
        type:       'page',
        config:     {
            name:        'update',
            scheme:      '/update/',
            title:       'Update Page',
            description: 'User Update Access',
            accessor:     false,
            restrict:    { true: null, false: 'login' },
            page:        {
                title:      (path, usr) => `Update | ${Object.values(((usr||{}).Profile||{}).Name||{}).join(' ')}`,
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'cover',
            },
        },
    },
    Services:   {
        type:       'page',
        config:     {
            name:        'services',
            scheme:      '/services/',
            title:       'Services Page',
            description: 'Service Provide Access',
            accessor:     false,
            restrict:    { true: null, false: 'login' },
            page:        {
                title:      (path, usr) => `Services | ${Object.values(((usr||{}).Profile||{}).Name||{}).join(' ')}`,
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'cover',
            },
        },
    },
    Profile:    {
        type:       'page',
        config:     {
            name:        'profile',
            scheme:      '/(([\\w_-]|\\.(?!html?|je?pg|pdf|gif|svg|ico|png|(doc|xls|ppt)x?))+|profile)/',
            title:       'Profile Page',
            description: 'Displaying User Profiles',
            accessor:     false,
            restrict:    { true: null, false: 'login' },
            errorIF:     (ret) => (Object.keys(ret).length==0),
            page:        {
                title:      (path,usr,pay) => `Profile | ${Object.values((pay||{}).name||[]).join(' ')}`,
                CSS:        ['style'],
                styles:      false,
                main:       'evectr',
                type:       'cover',
            },
        },
    },
};
