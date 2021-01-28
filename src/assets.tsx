const iconoclast_assets:any = {
    main_logo: '',
    login_page_logo: 'https://zoiqclients.s3.amazonaws.com/IconoclastArtist/IconoclastArtistsLogos/Iconoclast_Logo-Full-Color.svg',
    loader_logo: ''
}

const curate_assets:any = {
    main_logo: '',
    login_page_logo: 'https://zoiqclients.s3.amazonaws.com/ProjectCurate/ProjectCurateLogos/curate_full_logo.png',
    loader_logo: ''
}

export function getAsset(clientKey: string, key: string) {
    if (clientKey === 'iconoclast') {
        return iconoclast_assets[key]
    } else if (clientKey === 'curate') {
        return curate_assets[key]
    }
}