---
title: Optimizing APIs by Design
publishedAt: 2019-02-27 00:00:00
author: judah-t-anthony
excerpt: REST, GraphQL, JSON:API, oh my!
tags: 
  - GraphQL
  - REST
  - JSON
  - HTTP/2
  - API
source:
  name: Medium
  url: https://medium.com/plated-engineering/optimizing-apis-by-design-1ddd0a3567b7
---

When creating an API to expose some data to a client, there are many different aspects one must consider that will greatly impact the access patterns and performance characteristics. I will look at 4 common API designs, and see how they measure up.

In order to “measure” these API designs, we need to know by what metrics we are comparing. For the purposes of this article, I’m going to compare them on:

**Latency —** I use this term kind of liberally, but I’m using it as the total amount of time it takes to request all the necessary data. This is greatly impacted by the number of requests that need to be made.
**References —** This is generally how well the schema handles relational data. Does the API duplicate foreign objects?
**Overfetching —** Arguable the previous metric is a version of this metric, but essentially I want to measure whether the API has given the client only what it needs.
**Caching —** How easy is it to cache (and therefore scale) the design.

How did I get these metrics from all the possible ways one could analyze a communication protocol? I just made them up. :) Also, these metrics will be scored on the highly precise scale of ✕ and ✓.

Now that we have all that “math” behind us, what is the data that we will be using? For the sake of comparing these patterns, I’m going to be using the completely hypothetical models of:

![Boxes API](/images/posts/1__ocjlUKRckRKq4jwtzlCCw.webp "Boxes API")

Okay, let’s get started.

## REST

The good old Representational State Transfer. This format finds its beginning in 1994 and is really embedded into the way HTTP works. As such, it enjoys really great compatibility and huge adoption. The overall theme of REST is that every object is identified (and requested by) a particular Uniform Resource Identifier, or URI for short, that is usually made up of the object type and the object identifier. For example `/api/v1/box/123`.

This is convenient because you can also serve an index to all objects of that type by requesting the type root, in our example `/api/v1/box`. This index could be as simple as a list of IDs, but sometime folks will actually serve a “teaser” version of the objects there. I’m a fan of the former, as it makes caching even more straight forward.

Let look at the access pattern of this. First, you have to make a request for a box (or a list of boxes (or the box index and then request each box individually)).

```
GET /api/v1/box/123 HTTP/1.1
...
HTTP/1.1 200 OK
...
{
  id: 123,
  deliveryDate: 1549997322306,
  status: "pending",
  recipes: [1, 2, 3, 4]
}
```

Then, you would have to make calls for each individual recipe after having downloaded and parsed the box response.

```
GET /api/v1/recipe/1 HTTP/1.1
...
HTTP/1.1 200 OK
...
{
  id: 1,
  boxId: 123,
  title: "Mac-n-Cheese",
  subtitle: "with a side of love",
  imageURL: "/some/fancy/image.png"
}
```

This has the advantage of fully leveraging caching (both browser and proxy) and having a straight forward cache invalidation strategy. However, due to the multiple network connections, every single recipe request has to wait for the TCP connection, the TLS handshake, all the request headers to be sent, all the box JSON to be downloaded and parsed. And then each recipe request has to go through the same routine. This means slow response time in the client.

So how does this pan out?

* latency ✕
* references ✓
* overfetching ✕
* caching ✓

So how can we solve some of these disadvantages of pure REST?

## Modified REST

The easiest way to solve this is to create a unique JSON endpoint that specifically embeds the recipe objects into the boxes. (It could be argued that this isn’t REST at all. It is just a JSON endpoint, but I digress.)

This JSON endpoint could look like this:

```
GET /api/v1/boxes HTTP/1.1
...
HTTP/1.1 200 OK
...
[
  {
    id: 123,
    deliveryDate: 1549997322306,
    status: "pending",
    recipes: [
      {
        id: 1,
        boxId: 123,
        title: "Mac-n-Cheese",
        subtitle: "with a side of love",
        imageURL: "/some/fancy/image.png"
      },
      {
        id: 2,
        boxId: 123,
        title: "PB & J",
        subtitle: "with a side of love",
        imageURL: "/some/fancy/image2.png"
      },
      {
        id: 3,
        boxId: 123,
        title: "Ice cream",
        subtitle: "with a side of love",
        imageURL: "/some/fancy/image3.png"
      }
    ]
  }
]
```

This works great. You can grab all your boxes, and all the recipes in each box, all in a single HTTP request. However, there is a couple of problems here. Let’s start with caching. Now that we have bound all the objects together into a single endpoint, this means that if any of the boxes or any of the recipes gets updated, we need to invalidate this cache. This will have an impact of the cache HIT/MISS rate of this request.

In addition, in the circumstance that one of your users really likes ice cream (and who wouldn’t) and they have three boxes with four orders of ice cream each, this response would include 12 copies of the same recipe object.

What does this add up to?

* latency ✓
* references ✕
* overfetching ✕
* caching ✕

Wow! We got our data in a single request; however, it was at the expense of both reference vs. copy and caching. What to do?

Well, we have already modified this JSON endpoint. We could just change it again. What if we move the `recipe` object out of the `box` object, but keep it in the single request?

```
GET /api/v1/boxes-with-recipes HTTP/1.1
...
HTTP/1.1 200 OK
...
{
  boxes: [
    {
      id: 123,
      deliveryDate: 1549997322306,
      status: "pending",
      recipes: [3, 3, 3, 3]
    }
  ],
  recipes: [
    {
      id: 3,
      boxId: 123,
      title: "Ice cream",
      subtitle: "with a side of love",
      imageURL: "/some/fancy/image3.png"
    }
  ]
}
```

Where does that get us?

* latency ✓
* references ✓
* overfetching ✕
* caching ✕

That’s a little better, but REST in all its forms still suffers from the problem that the server is who decides what data is served. This can be good for caching, but it is bad for overfetching. If we could somehow allow the client to decide how much data it wants, we would see returns in flexibility and the ability to rapidly prototype new features. Cue GraphQL

## GraphQL

GraphQL is a relatively new protocol that allows the server to define the schemas (data structure and relationship); however, the client defines what data, of that schema, it wants. So for example. If I wanted to request both a users boxes and recipes but only want the recipe name. I could make a request like:

```
POST /graphql HTTP/1.1
...
BoxesQuery {
  edges {
    id
    deliveryDate
    status
    recipes {
      edges {
        title
      }
    }
  }
}
```

And I would get back something like this:

```
HTTP/1.1 200 OK
...
{
  data: {
    edges: [
      {
        id: 123,
        deliveryDate: 1549997322306,
        status: "pending",
        recipes: {
          edges: [
            {
              title: "Ice cream"
            },
            {
              title: "Ice cream"
            },
            {
              title: "Ice cream"
            },
            {
              title: "Ice cream"
            }
          ]
        }
      }
    ]
  }
}
```

Oh no! In addition to just being syntactically verbose, we have the same problem of copying objects. How does this measure up?

* latency ✓
* references ✕
* overfetching ✓
* caching ✕

We solved the problem of overfetching, but at the cost of duplication. How do we fix this?

## Modified GraphQL

Well, there is not traditional way to do this; however, GraphQL is super flexible, and it allows you to define any type of resolver. So we could create a `BoxesRecipeQuery` resolver that allows you to query for boxes but also provide those boxes to the context of its children in order to query the recipes of those boxes at the same time.

This could be implemented something like this:

```
POST /graphql HTTP/1.1
...
BoxesRecipesQuery {
  edges {
    id
    deliveryDate
    status
    recipeIDs
  }
  recipes {
    edges {
      title
    }
  }
}
```

This would then yield:

```
HTTP/1.1 200 OK
...
{
  data: {
    edges: [
      {
        id: 123,
        deliveryDate: 1549997322306,
        status: "pending",
        recipeIDs: [333]
      }
    ],
    recipes: {
      edges: [
        {
          title: "Ice cream"
        }
      ]
    }
  }
}
```

Wonderful! This gets us a single request, that has no object duplication, and allows the client to decide what data it needs.

* latency ✓
* references ✓
* overfetching ✓
* caching ✕

GraphQL is infinitely flexible and inherently relational. The only downside is these characteristics make caching these request difficult and unpredictable. This kind of system requires a very smart caching system that understand the structure and relationship of that data.

Client defined data seems like the ultimate “killer app”. Why didn’t we think about this before?

## JSON:API

We did.

JSON:API was originally drafted by Yehuda Katz ([super smart dude](http://twitter.com/wycats)) in May 2013. This little known spec is really well thought out (though admittedly quite complex). What would our toy example look like in this format?

```
GET /api/v1/boxes?include=recipes&fields[recipe]=title HTTP/1.1
...
HTTP/1.1 200 OK
...
{
  data: [
    {
      type: "box",
      id: 123,
      attributes: {
        deliveryDate: 1549997322306,
        status: "pending"
      },
      relationships: {
        recipes: {
          data: [
            { id: 3, type: "recipe" },
            { id: 3, type: "recipe" },
            { id: 3, type: "recipe" },
            { id: 3, type: "recipe" }
          ]
        }
      }
    }
  ],
  included: [
    {
      type: "recipe",
      id: 3,
      attributes: {
        title: "Ice cream"
      }
    }
  ]
}
```

What is going on here? The request is for a list of boxes; however, right there in the query param, we are telling the server to include in the response information about the related recipes and we are whitelisting the exact data we want for the recipes.

This has many of the same advantages and arguably disadvantages of GraphQL; therefore, it is no surprise that its performance metrics match it:

* latency ✓
* references ✓
* overfetching ✓
* caching ✕

This protocol is a little more HTTP friendly, so it actually caches a little easier than GraphQL. On the other hand, the full spec is quite big and difficult to fully implement correctly, so I wasn’t feeling very generous.

Finally, for the fourth method, I would like to circle back around to REST

## REST + HTTP/2

HTTP/2 + REST enables some pretty interesting things.

The actual REST protocol would not have to change at all. The objects would still be independently requested and cached. So how does HTTP/2 help?

Well, where the original REST protocol over normal HTTP has to download the entire `box` objects and parse them, before it knows what other resources it needs to request. HTTP/2 allows applications to send `Link` headers in order to hint to the client what other resources are required to fulfill the request. This allows the client to download these, in our case recipe, objects before the original object has even finished downloading.

This also doesn’t bypass the browsers own cache. Whereas, the modified REST schema above will unconditionally send a recipe, even if the browser has seen that recipe in the past; with HTTP/2, the browser will check its own cache to see if it already has a valid response.

You might want to point out that all these requests still require separate calls to the server, and you would be right; however, HTTP/2 allows the browser to multiplex the single TCP connection, so you don’t have to go through the whole TCP connection TLS handshake ritual. This optimizes your NIC utilization.

The only remaining downside to the multiple request is the duplication in the request headers; however, the HTTPS/2 architects have thought of that too. The protocol suggestions an optional, but clever, compression technique that can be used across requests on the multiplexed TCP connection. This allows all the header, which are almost entirely identical to be compressed down to almost nothing.

Where does that get us?

* latency ✓
* references ✓
* overfetching ✕
* caching ✓

I had to still ding it on the overfetching, as in the traditional version of REST, because the client cannot request specific data. This is a feature not a flaw. We could alter it to use a similar query param mechanism as JSON:API; however, then we run into the unavoidable trade-off between flexibility and cacheability. If you want to request the data in any number of ways, you will have trouble caching it. If you want to cache a single (or small number of) view into the data, then you will have to sacrifice flexibility.

This is where we earn our keep as engineers. We need to understand the requirements of our applications and the performance characteristics of our API design and make informed decisions.

Okay, okay. So I’m cheating. HTTPS/2 isn’t an API format. It is a transport layer protocol. But I thought it was worth throwing it in there to demonstrate how innovations in other parts of the OSI stack can have a huge impact in how we design our applications.

We haven’t even begun to understand how HTTP/2 will impact how we create applications. What does this mean for image sprites? What does this mean for domain aliases to increase parallel downloading? And most exciting, what does this mean for how we bundle JS?

## Conclusion

When you are designing an API, there are many factors you have to take into consideration. How much data are you working with? How relational is the data? How much duplication is in the data? How easy it to use? Does the app need all of the data up front, or can it lazy load any? Do you need to support a full CRUD (create, read, update, and delete) functionality, or is it is just a data feed?

The more you know about the access patterns and performance needs, the better you can tune that API design to suit your particular application. That means getting out there and learning new things. Have you heard of HyperMedia APIs? Go read about it! I’ve just covered JSON based APIs. There are also XML based APIs and even binary based protocols.

Don’t just stop there. Learn about the entire [OSI stack](https://en.wikipedia.org/wiki/OSI_model). Learn about HTTP/2. Did you know the industry is working on HTTP/3, and it may not even be based on TCP? I have a feeling that many of the best practices of today will look like anti-patterns a couple years from now.

As engineers, we have to both understand the tools of the trade, and keep out eyes on the horizon.
