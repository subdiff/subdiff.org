import RSS from 'rss';

export default defineEventHandler(async (event) => {
    const feed = new RSS({
        title: 'subdiff.org blog',
        site_url: 'https://subdiff.org',
        feed_url: `https://subdiff.org/blog/feed.xml`,
    });

    const blogPosts = await queryCollection(event, 'blog')
        .where('draft', '<>', true)
        .order('date', 'DESC')
        .all();

    for (const doc of blogPosts) {
        feed.item({
            title: doc.title ?? '-',
            url: `https://subdiff.org${doc.path}`,
            date: doc.date,
            description: doc.description,
            enclosure: {
                'url': `https://subdiff.org${doc.path}.jpg`,
                'type': 'image/jpeg'
            }
        });
    }

    const feedString = feed.xml({ indent: true });
    event.node.res.setHeader('content-type', 'text/xml');
    event.node.res.end(feedString);
});
