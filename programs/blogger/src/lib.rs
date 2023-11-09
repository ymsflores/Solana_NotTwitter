use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

declare_id!("GhtcnRfdetQQYiZX3BScjCS5bh39aTuQ4fC797khZrgi");

#[program]
pub mod blogger {
    use super::*;

    #[error_code]
    pub enum ErrorCode {
        #[msg("The provided topic should be 50 characters long maximum.")]
        TopicTooLong,
        #[msg("The provided content should be 280 characters long maximum.")]
        TextTooLong,
    }

    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> Result<()> {
        let tweet: &mut Account<Tweet> = &mut ctx.accounts.tweet; // Access the tweet account initialized by the init account constraint
        let author: &Signer = &ctx.accounts.author;
        let clock: Clock = Clock::get().unwrap();

        // Enforcing our chosen character limits
        if topic.chars().count() > 50 {
            return Err(error!(ErrorCode::TopicTooLong));
        }

        if content.chars().count() > 280 {
            return Err(error!(ErrorCode::TextTooLong));
        }

        tweet.author = *author.key; // Dereference author.key
        tweet.timestamp = clock.unix_timestamp;
        tweet.topic = topic;
        tweet.content = content;

        Ok(())
    }
}

// This is the "initialize" function
#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer = author, space = Tweet::LEN)]
    pub tweet: Account<'info, Tweet>, // The instruction will create this account (Passes the pubkey that should be used to create the account)
    #[account(mut)]
    // Specifies that the next line (author) is mutable as the amount of money in their account will mutate
    pub author: Signer<'info>, // Prove this account is the one sending the tweet
    pub system_program: Program<'info, System>, // We must pass the System type to ensure it is the official System program
}

// Define structure of our tweet (account)
#[account]
pub struct Tweet {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}

// Sizing our tweets
const DISCRIMINATOR_LEN: usize = 8;
const PUBLIC_KEY_LEN: usize = 32;
const TIMESTAMP_LEN: usize = 8;
const STRING_LEN: usize = 4; // Marks the size of string
const MAX_TOPIC_LEN: usize = 50 * 4; // 50 chars max
const MAX_TEXT_LEN: usize = 250 * 4; // 250 chars max

// Provide the total size of tweets using the constants
impl Tweet {
    const LEN: usize = DISCRIMINATOR_LEN
        + PUBLIC_KEY_LEN
        + TIMESTAMP_LEN
        + STRING_LEN
        + MAX_TOPIC_LEN
        + STRING_LEN
        + MAX_TEXT_LEN;
}

