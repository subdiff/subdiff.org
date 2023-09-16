<template>
    <div class="card">
        <div class="card-image">
            <figure class="image is-21by9">
                <NuxtLink :to="post.path">
                    <img :src="post.cover_image.src" alt="Placeholder image" />
                </NuxtLink>
            </figure>
        </div>

        <div class="card-content">
            <h1 class="title">
                <NuxtLink class="title is-4" :to="post.path">{{ post.title }}</NuxtLink>
            </h1>
            <p class="content">
                {{ post.description }}
            </p>
        </div>

        <footer class="card-footer">
            <p class="card-footer-item">
                <span>
                    <NuxtLink :to="post.path">Read more</NuxtLink>
                </span>
            </p>
        </footer>
    </div>
</template>

<script>
export default {
    props: ['post']
}
</script>