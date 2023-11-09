import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Blogger } from "../target/types/blogger";
import * as assert from "assert";
import * as Web3 from "@solana/web3.js";
import base58 from "bs58";

describe("blogger", () => {
  anchor.setProvider(anchor.AnchorProvider.env()); // Generate new Provider using our Anchor.toml file
  const provider = anchor.getProvider(); // Get our Provider
  const program = anchor.workspace.Blogger as Program<Blogger>;

  // Tweet
  it("Should tweet!", async () => {
    const tweet = anchor.web3.Keypair.generate(); // Generate new keypair for our tweet account

    await program.methods
      .sendTweet("My topic", "Let's talk about the Solana blockchain")
      .accounts({
        tweet: tweet.publicKey,
        author: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId, // pubkey of the official System Progarm
      })
      .signers([tweet])
      .rpc();

    // Fetch account details of the tweet we created
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    assert.equal(tweetAccount.author.toBase58(), provider.publicKey.toBase58()); // need to convert to base 58 because both are public key objects and are therefore different REFERENCES
    assert.equal(tweetAccount.topic, "My topic");
    assert.equal(tweetAccount.content, "Let's talk about the Solana blockchain");
    assert.ok(tweetAccount.timestamp);
  });

  // Tweet WITHOUT TOPIC or EMPTY TOPIC
  it("Should tweet without a topic!", async () => {
    const tweet = anchor.web3.Keypair.generate(); // Generate new keypair for our tweet account

    await program.methods
      .sendTweet("", "I hate writing topics!")
      .accounts({
        tweet: tweet.publicKey,
        author: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId, // pubkey of the official System Progarm
      })
      .signers([tweet])
      .rpc();

    // Fetch account details of the tweet we created
    const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

    assert.equal(tweetAccount.author.toBase58(), provider.publicKey.toBase58()); // need to convert to base 58 because both are public key objects and are therefore different REFERENCES
    assert.equal(tweetAccount.topic, "");
    assert.equal(tweetAccount.content, "I hate writing topics!");
    assert.ok(tweetAccount.timestamp);
  });

  // Test topic length
  it("cannot provide a topic with more than 50 characters", async () => {
    try {
      const tweet = anchor.web3.Keypair.generate();
      const testTopic = "a".repeat(51);

      await program.methods
        .sendTweet(testTopic, "This topic is more than 50 chars long!")
        .accounts({
          tweet: tweet.publicKey,
          author: provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId, // pubkey of the official System Progarm
        })
        .signers([tweet])
        .rpc();
    } catch (error) {
      //assert.equal(error.msg, "The provided topic should be 50 characters long maximum.");
      return;
    }
    assert.fail("The enforced topic limit is not working.");
  }); 

  // // Test body length
  // it("cannot provide a content with more than 250 characters", async () => {
  //   try {
  //     const tweet = anchor.web3.Keypair.generate();
  //     const testText = "a".repeat(251);

  //     await program.methods
  //       .sendTweet("A topic", testText)
  //       .accounts({
  //         tweet: tweet.publicKey,
  //         author: provider.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId, // pubkey of the official System Progarm
  //       })
  //       .signers([tweet])
  //       .rpc();
  //   } catch (error) {
  //     console.log(error);
  //     //assert.equal(error.msg, "The provided topic should be 250 characters long maximum.");
  //     return;
  //   }
  //   assert.fail("The enforced topic limit is not working...");
  // });

   // Fetch all tweets
  it('Should fetch all tweets!', async () => {
    const tweetAccounts = await program.account.tweet.all();
   // assert.equal(tweetAccounts.length, 3);
  });

});

// // Tweet from a DIFFERENT AUTHOR
// it("Should tweet for a different author!", async () => {
//   // Generate new keypair (account) for other user and send SOL to it so it can pay for the transaction
//   // This does not work because ConfirmTransaction is deprecated :(
//   const decoded = base58.decode('3PxcsrsGjjocSkGprAGG6N4Tx5HoWAyiMVGbppS54Y6S2h31QUH2Z2iiMW1AatQNzMXECE8MQQ1GenXbdPw5Sy43')
//   const keyPair = Web3.Keypair.fromSecretKey(decoded)
//   const otherUser = anchor.web3.Keypair.generate();
//   const instruction = Web3.SystemProgram.transfer({
//     fromPubkey: new Web3.PublicKey(provider.publicKey),
//     toPubkey: new Web3.PublicKey(otherUser.publicKey),
//     lamports: 1000000000,
//   });
//   const transaction = new Web3.Transaction();
//   transaction.add(instruction);
//   const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))
//   const txSignature = await Web3.sendAndConfirmTransaction(connection, transaction,);

//   // Generate new keypair for our tweet account
//   const tweet = anchor.web3.Keypair.generate();

//   await program.methods
//     .sendTweet("", "I hate writing topics!")
//     .accounts({
//       tweet: tweet.publicKey,
//       author: otherUser.publicKey,
//       systemProgram: anchor.web3.SystemProgram.programId, // pubkey of the official System Progarm
//     })
//     .signers([otherUser, tweet])
//     .rpc();

//   // Fetch account details of the tweet we created
//   const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

//   assert.equal(tweetAccount.author.toBase58(), otherUser.publicKey.toBase58()); // need to convert to base 58 because both are public key objects and are therefore different REFERENCES
//   assert.equal(tweetAccount.topic, "");
//   assert.equal(tweetAccount.content, "I hate writing topics!");
//   assert.ok(tweetAccount.timestamp);
// });
