---
title: Backpressure in data streams
publishedAt: 2019-11-13 00:00:00
author: judah-t-anthony
image: 
excerpt: 
tags: 
  - Software Development
  - Software Design
  - Distributed Systems
  - Backpressure
source:
  name: Medium
  url: https://medium.com/plated-engineering/backpressure-in-data-streams-19479c16aa09
---

Would you like to say goodbye to rush hour traffic all together? The reason why rush hour traffic occurs in the first place is because you are trying to fit an inherently variable (and worse yet spiky) number of cars through a finite resource (the roadways).

Wouldn’t you love if you could just sit in the comfort of your home waiting for just the right time to leave, and then when you leave, you can zip right to your destination with no congestion? What you are imagining is what in Software Architecture we call **backpressure**.

## What is backpressure?

A chain is only as strong as its weakest link. In computer science, any chain of dependent events is also only as efficient as its slowest process. In modern systems (and especially distributed systems) this chain of dependent events looks more like a complex web of semi-dependent processes or services; however, the concept is still the same.

If you want an exhaustive discussion on backpressure check out the [wiki article](https://en.wikipedia.org/wiki/Backpressure_routing); however, for our discussion I’m defining backpressure as a technique used in queue systems to throttle the flow in the hopes of optimizing the use of resources. In this article, I’m going to focus on streaming data in applications and/or services; however, it is most popularly known for its use in routing network traffic.

## A canonical example

A network whether intranet or internet is a web of nodes (computers, routers, and switches) connected to other nodes. This topology means there is often many ways to get from point A to point B. At the same time, every node has a unique set of parameters which include inputs, outputs, and internal speed.

It is possible a particular router on the critical path between a set of IPs can get overwhelmed with the number of request coming into it to the point that its own internal buffers are completely saturated. What happens when the next incoming request comes in? Well, the router will simply tosses out one of the queued packets (or more likely writes the new one over an existing one). Which one does it choose? Presuming there is no QoS or traffic shaping going on, any of them. That is right. The router will just toss out a packet at random.

This may seem like an odd practice for a protocol that is known for its resilience; however, that is the beauty. The TCP protocol is built in a way that if there is no confirmation for a packet, it will be retried. In addition, if a particular interface is dropping a lot of packets the router will try sending the packets on another interface that supports that IP range. This is how downstream routers and computers can throttle upstream ones. This creates a balancing and auto-repairing effect when scaled out over the entire network.

## Application backpressure in practice

We are going to explore in detail how this technique might show up in Application Design. For this, I’m going to use a hypothetical encryption application.

I’m using this as an example because streaming data and file system applications often have the performance characteristics that require the use of backpressure, specifically because filesystem read operations are much faster than write operations.

### The naive design

The simplest requirements of the application is for the system to read the contents of a file, encrypt it, and then write it back to disk.

In abstract terms what that would look like is this:

![Read](/images/posts/1_tEYipTKWnIsvk1zbwfmRuA.webp "Read")

First you would read the entire contents of the file into a buffer and then pass it off to the encryption routine.

![Encrypt](/images/posts/1_GTodN3Z6pwNu8kNKitp04Q.webp "Encrypt")

Next, the encryption routine would read the data out of the buffer, combine it with a secret key, and encrypt the data into another buffer. It would then pass that encrypted buffer off to a write routine.

![Write](/images/posts/1_lMks_I8qbxSPzcG0D1WOtA.webp "Write")

Finally, the write routine would read the data out of the buffer and write it to disk.

This design is simple and actually quite efficient. This is the fastest way to solve this problem both in developer performance and runtime performance (clock time). In addition, you don’t have to worry about corrupted files because this is an all-or-nothing approach.

The problem comes when you want to encrypt massive files. As you can see, we are reading the entire file into memory. In addition, we are copying into a new buffer the entire file. That means if we are encrypting a 5GB file, this could eat up as much as 10GB of memory. I hope you have a lot of memory, and don’t even try to do this with multiple files at once.

![Memory usage of our naive approach](/images/posts/1_nBAMYZddmRuSFmQVsDnZqQ.webp "Memory usage of our naive approach")

If we examine the memory usage over time, you can see our service peaks out at 10GB almost immediately. Even after the first buffer gets garbage collected, the 5GB buffer is held until the final file-write operation complete.

### Streaming the data

If we want to reduce the memory footprint of this and maybe even open the opportunity to multiplex other activities, we are going to have to break this big problem up into many smaller tasks. Let’s do this by running each step in our chain concurrently and streaming the data in smaller chunks from one to the other.

So how this will work is the read routine will read in a smaller chunk, let’s say 10KB, into a buffer. It will pass that on to the encryption routine, which will encrypt just that smaller chunk and pass it onto the write route. How will that affect our memory consumption?

![Memory usage of streaming data](/images/posts/1_YUZVBlNv3XQ6kd6BJY6mGQ.webp "Memory usage of streaming data")

That is better, but a 4GB peak is much higher than our allocated 10KB buffer. What is going on here?

The problem arises due to the fact that each of these concurrent processes has a different throughput. For this toy example, I gave the read operation a rate of 5, encrypt 3, and write 1. The finite numbers are not as important as their relative ratio to each other.

Let’s look at what happens in our application step-by-step.

![Step 1](/images/posts/1_PDEe318F7YCm2BP1F9CT9g.webp "Step 1")

You can see that the Read step can process 5 units of data/time.

![Step 2](/images/posts/1_-Fl46dDRnqHWUB2RKJgu_g.webp "Step 2")

While the Encrypt routine is working on that first batch, the Read process is loading up the next.

![Step 3](/images/posts/1_5YQI9ruRENFvcleZyxjdvw.webp "Step 3")

You can see here something is starting to look funny. While the Read routine processed 5 data/time units and loaded it into Encrypt’s next buffer, Encrypt only processed 3 units and still has 2 units left in its own queue.

![Step 4](/images/posts/1_HHgkIJKqXJjmMQjzP6xsig.webp "Step 4")

Now you can see the crux of the problem. The write routine processed 1 unit and had 3 more pushed into its buffer. The Encrypt routine has also netted an additional 2 units. Because the earlier routines have a greater throughput than the later ones, there is a a build up of chunks to process. These chunks have to be stored in memory, so the memory usage still continues to expand to accommodate.

### Using a read-based pull approach

In order to optimize the resource usage, we need some way to signal to upstream resources some concept of our downstream capacity. This is the main take away from backpressure. In the router example, we used dropped packets. In our car traffic example, we used a phone call to let you know it is clear to head to your destination.

In our encryption example, we can let a direct call for more data be the signal. How this works is, instead of the each process pushing data into the next process, we are going to design the downstream processes to pull the data that they are capable of processing from the upstream processes. This is similar to the idea of inversion of control in dependency management.

![Step 1](/images/posts/1_Lngy2Lrmp23k_6-71Vedrw.webp "Step 1")

The first thing that happens is the write routine prepares to write its block, but it has no data, so it asks for one block from the encryption routine. The encryption routine has no data, so it asks the read routine. The read routine has no data, so it pulls it from the file system.

![Step 2 & 3](/images/posts/1_mHsrW6Ehap1a5_dFNbHJDw.webp "Step 2 & 3")

The encrypt routine only needed three units to fill its buffers, and the write routine only needed one. Here is the key. Instead of the read routine starting on the next block, the whole system is timed off the write routine.

![Step 4](/images/posts/1_0Hp9K1P82RZ5nvTBdVQI9g.webp "Step 4")

When the write routine asks for the next block, the encryption routine already has everything it needs to fulfill the request in its own buffer. It is only when the encryption routine’s buffer can’t fulfill the write request, does it ask for more from the read routine.

The key to this technique is:
1. the flow is drive from the sink or destination
2. each routine asks for the amount that is wants to process
3. each routine provides no more (but potentially less) than the amount requested
4. each routine can signal either the end of the stream or an error back to the requester

Each of these characteristics is key, and if done successfully the time will be capped by the slowest process and the memory will be capped by the sum of the max buffer of each process.

## Conclusion

The technique of backpressure involves setting up a mechanism by which downstream processes can signal to upstream processes some indication of their capacity in order for those upstream processes to either throttle their own actions or perform some other sort of optimization (for example, rerouting or scaling). This technique can be useful in all sorts of circumstances that have the characteristics of multiple, autonomous, concurrent processes that are inter-dependent, and have varying capacities.

Our example was optimizing a singe application that was resource bound and had differing rates of operation (disk reads are always much faster than disk writes). Another good example might be coordinating workflows in distributed systems.

What novel usages of this technique have you seen in the wild?
