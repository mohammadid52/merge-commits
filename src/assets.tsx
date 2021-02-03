const iconoclast_assets:any = {
    main_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg',
    login_page_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg',
    loading_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-COLOR.svg',
    logo_symbol: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Symbol.png',
    faviconDefault: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/favicon.ico',
    favicon16x16: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/favicon-16x16.png',
    favicon32x32: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/favicon-32x32.png'
}

const curate_assets:any = {
    main_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/curate_full_logo_white.png',
    login_page_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/curate_full_logo.png',
    loading_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/curate_full_logo.png',
    logo_symbol: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/curate_blue_icon_169x169+(2).png',
    faviconDefault: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/favicon.ico',
    favicon16x16: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/favicon-16x16.png',
    favicon32x32: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/favicon-32x32.png'
}

export function getAsset(clientKey: string, key: string) {
    if (clientKey === 'iconoclast') {
        return iconoclast_assets[key]
    } else if (clientKey === 'curate') {
        return curate_assets[key]
    }
}