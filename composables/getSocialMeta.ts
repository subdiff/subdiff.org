export interface SocialMetaImage {
    url?: string
    alt?: string
    type?: string
    width?: number
    height?: number
    is_large?: boolean
}

export interface SocialMetaOptions {
    url?: string
    title?: string
    descr?: string
    type?: string
    author?: string
    date?: string
    img?: SocialMetaImage
}

export const getSocialMeta = (options: SocialMetaOptions = {}) => {
    const {
        url,
        title,
        descr,
        type = 'website',
        author,
        date,
        img = {},
    } = options

    return [
        {
            property: 'og:url',
            content: url
        },
        {
            property: 'og:type',
            content: type
        },
        {
            property: 'og:title',
            content: title
        },
        {
            name: 'description',
            property: 'og:description',
            content: descr
        },
        {
            name: 'twitter:description',
            content: descr
        },
        {
            name: 'author',
            property: 'article:author',
            content: author
        },
        {
            property: 'article:published_time',
            content: date
        },
        {
            property: 'og:image',
            content: img.url
        },
        {
            property: 'og:image:alt',
            content: img.alt
        },
        {
            property: 'og:image:type',
            content: img.type ? 'image/' + img.type : undefined
        },
        {
            property: 'og:image:width',
            content: img.width
        },
        {
            property: 'og:image:height',
            content: img.height
        },
        {
            name: 'twitter:card',
            content: img.is_large ? 'summary_large_image' : 'summary'
        },
        {
            name: 'twitter:site',
            content: '@subdiff',
        }
    ]
}
