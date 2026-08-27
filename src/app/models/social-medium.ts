export interface SocialMedium {
    name: string,
    shortcut: string,
    urlBase: string
}

export const followUs: SocialMedium[] = [
    {name: 'fediverse', shortcut: 'fedi', urlBase: 'https://tldr.nettime.org/@screensavergallery'},
    {name: 'telegram', shortcut: 'tlgrm', urlBase: 'https://t.me/screensavergallery'},
    {name: 'matrix', shortcut: 'matrix', urlBase: 'https://matrix.to/#/#screensaver.gallery:matrix.org'},
    {name: 'rss', shortcut: 'rss', urlBase: 'https://sleep.screensaver.gallery/feed/'},
    {name: 'instagram', shortcut: 'i', urlBase: 'https://www.instagram.com/screensavergallery/'},
    // {name: 'facebook', shortcut: 'fb', urlBase: 'https://www.facebook.com/ScreenSaverGallery'},
    {name: 'github', shortcut: 'git', urlBase: 'https://github.com/ScreenSaverGallery'},
    {name: 'newsletter', shortcut: 'monk', urlBase: 'https://listmonk.screensaver.gallery/subscription/form'}
];
