<script setup>
import { toRefs } from 'vue'

const props = defineProps({
    tweet: Object,
})

const { tweet } = toRefs(props)
</script>

<template>
    <div class="px-8 py-4 border-slate-800">
        <div class="mb-1">
            <h3 class="inline font-bold" :title="tweet.author">
                <router-link :to="{ name: 'Home' }" class="hover:underline">
                    {{ tweet.author_display }}
                </router-link>
            </h3>
            <span class="text-gray-500"> • </span>
            <time class="text-gray-500 text-sm" :title="tweet.created_at">
                {{ tweet.created_ago }}
            </time>
        </div>
        <p class="whitespace-pre-wrap" v-text="tweet.content"></p>
        <router-link v-if="tweet.topic" :to="{ name: 'Home' }" class="inline-block mt-2 text-sky-500 hover:underline">
            #{{ tweet.topic }}
        </router-link>
    </div>
</template>
