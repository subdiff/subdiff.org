export const getSocialMeta = (
    {
        url,
        title,
        descr,
        type,
        author,
        date,
        img = {
            url: string,
            alt: string,
            type: string,
            width: number,
            height: number,
            is_large: boolean,
        },
    } = {}
) => {
    return [
        {
            property: 'og:url',
            content: url
        },
        {
            property: 'og:type',
            content: type ? type : 'website'
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
            content: 'image/' + img.type
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
