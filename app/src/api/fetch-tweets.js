import { useWorkspace } from '@/composables'
import { Tweet } from '@/models'

export const fetchTweets = async (filters = []) => {
    const { program } = useWorkspace()
    const tweets = await program.value.account.tweet.all(filters);    // Use program.value since program is a reactive variable (wrapped in Ref obj)
    console.log(tweets);
    return tweets.map(tweet => new Tweet(tweet.publicKey, tweet.account))
}

export const authorFilter = authorBase58PublicKey => ({
    memcmp: {
        offset: 8, // Discriminator.
        bytes: authorBase58PublicKey,
    }
})