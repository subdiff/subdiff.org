export const getTags = (tags: [string]) => {
    let ret = []

    for (let tag of tags) {
        let obj = {
            id: tag,
            title: tag,
            path: '/blog/tags/' + tag,
        }
        ret.push(obj)
    }

    return ret
}