---
title: Intro to Cryptography
publishedAt: 2019-07-17 00:00:00
author: judah-t-anthony
image: /images/posts/intro-to-cryptography.png
excerpt: I’m going to introduce to you many cryptography primitives and show you how they fit together. I’ll also demonstrate how easy it is to get wrong.
tags: 
  - Security
  - Crypto
  - Vulnerability
  - Encryption
source:
  name: Medium
  url: https://medium.com/plated-engineering/intro-to-cryptography-c3ad8ab51fcc
---

## Symmetric vs Asymmetric

There are two large classifications of encryption: symmetric encryption and asymmetric encryption. The strongest and most commonly known encryption is symmetric.

### Symmetric Encryption

Symmetric encryption is where there is one encryption/decryption key. This key is your secret. In order for someone you are communicating with to be able to decrypt your message, you have to somehow arrange to have the key sent to your recipient. This requirement may sound trivial, but in fact this is the crux of most of the difficulty with implementing symmetric encryption. In fact, if this truly were no problem, then we have actually already developed foolproof perfect encryption.

### The Perfect Encryption

The perfect encryption cipher is also the simplest. All it requires is one simple low level operation: the mighty XOR.

```ruby
> message = "The quick brown fox jumps over a lazy dog."
 => "The quick brown fox jumps over a lazy dog."
# Get the raw byte array for this message string.
> message_bytes = message.bytes
 => [84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114, 111, 119, 110, 32, 102, 111, 120, 32, 106, 117, 109, 112, 115, 32, 111, 118, 101, 114, 32, 97, 32, 108, 97, 122, 121, 32, 100, 111, 103, 46]
# Create a private "key" using random data.
> key = Random.new.bytes(message_bytes.length).bytes
 => [69, 117, 121, 116, 59, 63, 159, 125, 81, 190, 125, 22, 143, 158, 76, 106, 94, 61, 115, 52, 10, 135, 239, 210, 86, 244, 108, 75, 44, 146, 45, 47, 170, 132, 188, 188, 75, 19, 227, 158, 183, 57]
# XOR (^) the raw data with the random data.
> cipher_text = message_bytes.map.with_index { |b, i| b ^ key[i] }
 => [17, 29, 28, 84, 74, 74, 246, 30, 58, 158, 31, 100, 224, 233, 34, 74, 56, 82, 11, 20, 96, 242, 130, 162, 37, 212, 3, 61, 73, 224, 13, 78, 138, 232, 221, 198, 50, 51, 135, 241, 208, 23]
```

Believe it or not, “cipher_text” is now a perfectly encrypted value. Don’t believe me? Well, we can decrypt the cipher text by simply running it through the same “cipher” using the same “key” (thus making this a symmetric cipher).

```ruby
# Decrypt the cipher text by XORing the key with the cipher text
# and packing it back into a string.
> cipher_text.map.with_index { |b, i| b ^ key[i] }.pack(“c*”)
 => “The quick brown fox jumps over a lazy dog.”
```

If this was the end of the story, the field of cryptography would be a pretty small one. As it is, there are two important caveats here that make this form of encryption rarely used. First, the source of randomness is crucially important. As you will learn, randomness is used often in cryptography and getting it right is vital to the security of the encryption. Second (and primarily), this cipher requires the key to be the same length as the message text and never reused.

The key length would be sufficiently onerous; however, let’s watch what happens when someone mistakenly reuses the key:

```ruby
> message2 = "We the people of the United States, in ..."
 => "We the people of the United States, in ..."
> message2_bytes = message2.bytes
 => [87, 101, 32, 116, 104, 101, 32, 112, 101, 111, 112, 108, 101, 32, 111, 102, 32, 116, 104, 101, 32, 85, 110, 105, 116, 101, 100, 32, 83, 116, 97, 116, 101, 115, 44, 32, 105, 110, 32, 46, 46, 46]
# We are encrypting a new [known] message using the same key.
> cipher2_text = message2_bytes.map.with_index { |b, i| b ^ key[i] }
 => [18, 16, 89, 0, 83, 90, 191, 13, 52, 209, 13, 122, 234, 190, 35, 12, 126, 73, 27, 81, 42, 210, 129, 187, 34, 145, 8, 107, 127, 230, 76, 91, 207, 247, 144, 156, 34, 125, 195, 176, 153, 23]
```

So what is wrong with this? Well in some ways, nothing. It is likewise perfectly encrypted, and if no one knows the key, then there is no way for them to get the message text out of it.

But on the other hand, if someone happens to already know the value of the plain text you just encrypted …

```ruby
# Note we are decrypting the original cipher_text without the key.
# We are reconstructing the key using our known plaintext
# (message2_bytes) and our known ciphertext (cipher2_text).
> cipher_text.map.with_index { |b, i| b ^ cipher2_text[i] ^ message2_bytes[i] }.pack("c*")
 => "The quick brown fox jumps over a lazy dog."
```

That’s right! You can use your known plain text in combination with the cipher_text from that plain text to reconstruct the encryption key, thus decrypting any other messages that were encrypted with that key.

## Defining our terms

Let’s use our previous example to identify a couple of key terms. In our example, we have some source of randomness to create the key. The key is a value (usually a byte array) that is combined with some plain_text to hide the value of the plain text.

In our case, we get our key from “Random.new.bytes”. This is actually pseudo-randomness, as it is actually NOT random. It is deterministically created, but it is seeded in a way that it is unguessable (presuming you did it right) if you don’t know any of the internal state.

That being said, seeding a pseudo-random number generator (PRNG) is adding unique data to its initial state to guarantee a completely new stream of bytes. Examples of unique data people use are microtime, network noise, or mouse/keyboard inputs. The best PRNGs use hardware to add quantum noise to the pool to guarantee true randomness.

The best seed is pure unique randomness because as mentioned PRNGs are actually deterministic; it is the seed that makes them unique. If someone knew the value of your seed, they could reproduce your random stream of data.

```ruby
> srand(123)
 => 123
> rand(10000)
 => 3582
> srand(123)
 => 123
> rand(10000)
 => 3582
```

As you saw before, things go awry in encryption when you don’t get your randomness right.

In our example, the simple operation of applying XOR “^” to the plain_text and the key to produce the cipher text would be called a cipher. A cipher is essentially the steps you take (the algorithm) to carry out the encryption. For example, in the [Caesar Cipher](https://en.wikipedia.org/wiki/Caesar_cipher) you simply map one alphabet (keyspace) to another by shifting all the letters by a certain number. As you might imagine, the number of shifts (forward 3, backward 13, etc.) would be the key for encryption.

## Cipher Modes

How the industry has addressed the problem of the size of the key is through the use of block cipher modes. With a block cipher, you break up your clear text into smaller blocks (usually 16 bytes), and then you encrypt each block using another cipher and a key that is usually the same size as the block.

One early and simple block cipher mode is the Electronic Codebook (ECB) mode. The ECB mode works by combining the encryption key into a cipher for each block of clear text.

![https://en.wikipedia.org/wiki/File:CBC_encryption.svg](/images/posts/1_03BfQgtpQWi2M63Tf5vffA.webp "https://en.wikipedia.org/wiki/File:CBC_encryption.svg")

The decryption occurs by simply feeding the cipher text through the same process.

![https://en.wikipedia.org/wiki/File:CBC_decryption.svg](/images/posts/1_QG2iQfJOdpoL4CpMDm440w.webp "https://en.wikipedia.org/wiki/File:CBC_decryption.svg")

One of the problems of this algorithm is that it maps the same block to the same value each time. To illustrate this point, check out this photo that was encrypted using both ECB and CBC (a block mode we will discuss soon) encryption:

![https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation](/images/posts/1_1IcasL0IuTUJSx9xASqJTw.webp "https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation")

As you can see, even if the initial value is hidden, information is leaked regarding the relationships of the data.

How the Cipher Block Chaining (CBC) mode gets around this is by feeding the cipher text from the previous block into the plain text of the next before it is encrypted. It also adds an initialization vector (IV) to the beginning to ensure that each run of the algorithm (even with the same plain text) will produce a very different cipher text.

![https://en.wikipedia.org/wiki/File:CBC_encryption.svg](/images/posts/1_IAFxh1Y-R6GUVcuHGsi-QA.webp "https://en.wikipedia.org/wiki/File:CBC_encryption.svg")

This decryption is a little trickier, but it is essentially the reverse operation.

![https://en.wikipedia.org/wiki/File:CBC_decryption.svg](/images/posts/1_wmhntqCrfcji-r-4kKPzbA.webp "https://en.wikipedia.org/wiki/File:CBC_decryption.svg")

This mode is very popular and is chosen for most of the TLS/SSL traffic on the Internet.

In addition to subtle padding oracle vulnerabilities, you have to be careful not to assume that just because some bit of cipher text is encrypted that it is necessarily secure.

## Known Plain Text Vulnerability

It is easy to assume that as long as someone doesn’t have the private key, that all communication using a well-vetted cipher and mode is secure. However, even if you do all the encryption perfectly, there can still be vulnerabilities to tampering if someone already knows the original plain text.

How can this be a vulnerability? If someone already knows it, then what are we concealing? Well, let’s say there is a hypothetical system that sends information about a user fully encrypted. We will use the string “user=admin&role=super" and encrypt it using the same method shown in the example in the [Ruby OpenSSL documentation](https://ruby-doc.org/stdlib-2.4.0/libdoc/openssl/rdoc/OpenSSL/Cipher.html):

```ruby
> message = "user=admin&role=super"
 => "user=admin&role=super"
> cipher = OpenSSL::Cipher.new('AES-128-CBC')
 => #<OpenSSL::Cipher:0x00007fa4749a99b0>
> cipher.encrypt
 => #<OpenSSL::Cipher:0x00007fa4749a99b0>
> key = cipher.random_key
 => "\x0F;\x12P\x82\xFC\x01\x96\xD6js\x98\xB0\xFA1]"
> iv = cipher.random_iv
 => "N\xF0\xF0a\xA8D2\x1D\x95\xE6[W+\xA8 \x8B"
> cipher_text = cipher.update(message) + cipher.final
 => "Vu\xA9\x98\xD35\x1D\x9AO?oyQ\x9E\xA2o!\x02\x06\xF6\xC8\x1E\x9A\xF2\xB7i\x8C\xBA\x18m\xC3\b"
```

What is wrong with this? Nothing. The message is perfectly encrypted and completely undecryptable without the secret (presumably pre-shared) key. But undecryptable and untamperable are not the same thing.

What would happen if someone tampered with the IV which is usually prefixed to the cipher text as part of the encrypted message?

```ruby
> iv.setbyte(5, iv.getbyte(5) ^ "a".ord ^ "j".ord)
 => 79
> iv.setbyte(6, iv.getbyte(6) ^ "d".ord ^ "u".ord)
 => 35
> iv.setbyte(7, iv.getbyte(7) ^ "m".ord ^ "d".ord)
 => 20
> iv.setbyte(8, iv.getbyte(8) ^ "i".ord ^ "a".ord)
=> 157
> iv.setbyte(9, iv.getbyte(9) ^ "n".ord ^ "h".ord)
 => 224
> decipher = OpenSSL::Cipher.new('AES-128-CBC')
 => #<OpenSSL::Cipher:0x00007fa4749b2060>
> decipher.decrypt
 => #<OpenSSL::Cipher:0x00007fa4749b2060>
> decipher.key = key
 => "\x0F;\x12P\x82\xFC\x01\x96\xD6js\x98\xB0\xFA1]"
> decipher.iv = iv
 => "N\xF0\xF0a\xA8O#\x14\x9D\xE0[W+\xA8 \x8B"
> plain_text = decipher.update(cipher_text) + decipher.final
 => "user=judah&role=super"
```

As you can see, even though I was not able to decrypt the message (as I didn’t have the secret key), I was able to alter the value to which the cipher text would ultimately be decrypted.

This is why it is important to either sign your encrypted messages using something like a hash-based, message authentication code ([HMAC](https://en.wikipedia.org/wiki/HMAC)) or to use a cipher mode that uses a signing key in addition to a secret key like Galois/Counter Mode ([GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)).

There is also another mode worth mentioning called Counter (CTR) mode. This is notable for its simplicity. This mode uses a key to encrypt a unique never repeated datum called a nonce and a counter to create a stream of randomness which can be combined (XORed) into your plaintext thus turning it into a stream mode.

## Conclusion

Encryption is a powerful technique for keeping secrets, but, as you can see, it is easy to get wrong. One lesson you should take away is to never “roll your own encryption”; however, even when using tried and true ciphers and modes, you need to carefully consider the promises and assumptions of any system to properly decide which algorithm would best serve your needs.
