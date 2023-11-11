<script setup>
import { ref, watchEffect } from 'vue'
import { fetchTweets, authorFilter } from '@/api'
import TweetList from '@/components/TweetList'
import { useWorkspace } from '@/composables'


const tweets = ref([])
const loading = ref(true)
const { wallet } = useWorkspace()

watchEffect(() => {
    if (! wallet.value) return
    fetchTweets([authorFilter(wallet.value.publicKey.toBase58())])
        .then(fetchedTweets => tweets.value = fetchedTweets)
        .finally(() => loading.value = false)
})

</script>

<template>
    <div v-if="wallet" class="border-b border-slate-800 px-8 py-4 bg-slate-700">
        {{ wallet.publicKey.toBase58() }}
    </div>
    <tweet-list :tweets="tweets" :loading="loading"></tweet-list>
</template>
