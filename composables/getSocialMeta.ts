export const getSocialMeta = (url: string, title: string, descr: string, img: any) => {
    return [
        {
            name: 'og:url',
            content: url
        },
        {
            name: 'og:type',
            content: 'website'
        },
        {
            name: 'og:title',
            content: title
        },
        {
            name: 'og:description',
            content: descr
        },
        {
            name: 'og:image',
            content: img.url
        },
        {
            name: 'og:image:alt',
            content: img.alt
        },
        {
            name: 'og:image:type',
            content: img.type
        },
        {
            name: 'og:image:width',
            content: img.width
        },
        {
            name: 'og:image:height',
            content: img.height
        },
        {
            name: 'twitter:card',
            content: 'summary_large_image'
        },
        {
            name: 'twitter:image',
            content: img.url
        },
        {
            name: 'twitter:image:alt',
            content: img.alt
        },
        {
            name: 'twitter:description',
            content: descr
        }
    ]
}