export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        if (!file._path.startsWith('/blog/')) {
            return
        }

        const id = file._path.slice(file._path.lastIndexOf('/') + 1)

        if (id != sluggify_to_url(file.title)) {
            throw createError({ statusMessage: "Path '" + id + "' not sluggified from title '" + file.title + "'" })
        }
    })
})

function sluggify_to_url(text) {
    // 1. Convert text to lower case.
    // 2. Replace one or multiple hyphens with a single space.
    // 3. Remove everything which is not alphanummeric or space.
    // 4. Replace one or multiple spaces with a single hyphen.
    return text.toLowerCase().replace(/-+/g, ' ').replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}