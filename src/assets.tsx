const iconoclast_assets: any = {
    appTitle: 'Iconoclast Artists',
    main_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-WHITE.svg',
    login_page_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg',
    loading_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-COLOR.svg',
    logo_symbol: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Symbol.png',
    faviconDefault: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/favicon.ico',
    favicon16x16: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/favicon-16x16.png',
    favicon32x32: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/favicon-32x32.png',
    manifest: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/site.webmanifest',
    appleTouchIcon: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/apple-touch-icon.png',
    maskIcon: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/safari-pinned-tab.svg',
    webAppTitle: 'Iconoclast',
    appName: 'Iconoclast',
    tileImage: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/mstile-144x144.png',
    msapplicationConfig: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/browserconfig.xml',
    authBackground: 'bg-iconoclast-bg',
    authButtonColor: 'bg-dark-red',
    themeClassName: 'iconoclastIndigo',
}

const curate_assets: any = {
    appTitle: 'Project Curate',
    main_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/ProjectCurateLogo-WhiteLetters.png',
    login_page_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/ProjectCurate_Logo.png',
    loading_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/ProjectCurate_Logo.png',
    logo_symbol: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/curate_blue_icon_169x169+(2).png',
    faviconDefault: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/favicon.ico',
    favicon16x16: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/favicon-16x16.png',
    favicon32x32: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/favicon-32x32.png',
    manifest: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/site.webmanifest',
    appleTouchIcon: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/apple-touch-icon.png',
    maskIcon: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/safari-pinned-tab.svg',
    webAppTitle: 'Project Curate',
    appName: 'Project Curate',
    tileImage: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/mstile-150x150.png',
    msapplicationConfig: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/browserconfig.xml',
    authBackground: 'bg-curate-bg',
    authButtonColor: 'bg-theme-blue',
    themeClassName: 'curateBlue',
}

export function getAsset(clientKey: string, key: string) {
    if (clientKey === 'iconoclast') {
        return iconoclast_assets[key]
    } else if (clientKey === 'curate') {
        return curate_assets[key]
    }
}