---
title: Netlify + Gatsby
publishedAt: 2019-11-13 00:00:00
author: judah-t-anthony
image: /images/posts/1_09uLIQ8OMgFVR74vryUw1A.webp
excerpt: Fast, secure, easy, and free way to get started with JAM-stacks
tags: 
  - Github
  - Netlify
  - Gatsbyjs
  - Jamstack
source:
  name: Medium
  url: https://medium.com/@judahtanthony/netlify-gatsby-653ab237cc79
---

Maybe you have heard of this new thing called the JAM-stack, but you just haven’t had the time to learn how to set up the build and deploy system that would be necessary to take advantage of this new methodology. That’s where [Netlify](https://www.netlify.com/) comes in. Netlify makes it easy to build a static website, deploy it to the edge, and then enhance it as necessary.

## JAM-stack

First things first. What is a JAM-stack? A JAM-stack is a, “modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.” You can learn all you want to know about this new pattern at [https://jamstack.org/](https://jamstack.org/).

This for me, is the next evolution of web development. I love dynamic sites. I make my living off dynamic sites, but why should we force the user to wait around while we dynamically generate a web page for them when there has been little to no change to the application state? In reality, we can compile ninety percent of a site at the point something is changed. This is often the most important parts of a site, the stuff that search engines are interested in, and the stuff that casual or anonymous users want immediate access to. On top of this base, all the other user-centric or highly volatile data can be loaded client-side through flexible APIs.

## What is Netlify?

Let me start out by saying, I’m not being paid by Netlify. They are not sponsoring me in any way. I am just a web developer who has found that they have a unique offering that makes building and scaling static sites crazy easy. Essentially, Netlify acts as a CI/CD and cloud hosting environment. They will build your site and atomically deploy it to edge cache servers around the world. In addition, they offer a huge amount of additional functionality to make your performant static site have a bit more of the flexibility and power of a dynamic site.

## Setting up Gatsby?

For this tutorial, I’m going to use Gatsby as my static site generator. Gatsby is particularly intriguing because it is the marriage of two popular web technologies, React and GraphQL, to create a fast and performant static site where you can reuse all your components on both the server-side and the client-side.

Let’s start by setting up Gatsby. The easiest way to do this is by installing the CLI app.

```sh
> npm install -g gatsby-cli
```

You should now have a working cli app named `gatsby`. We are going to use this to get us starter really quickly. Let’s use the `gatsby-starter-default` boilerplate to get us started. It is pretty barebones, but it will be enough for a proof of concept.

```sh
> gatsby new mysite https://github.com/gatsbyjs/gatsby-starter-default
> cd mysite/
> gatsby develop
```

That final command will build your site in dev mode and watch your files live-reloading as necessary. The output of the command will give you both the site URL and the GraphiQL URL for exploring your data.

![Gatsby Default Starter](/images/posts/1_rBdpHU2ky7PFI-GxjFFQeQ.webp "Gatsby Default Starter")

This starter also gives you a build job for building the site for production.

## Setting up the Repo

Deploying your site to Netlify can be as easy as dragging the public directory to the Netlify dashboard; however, one of the main advantages of it is its Github integration and auto-deploys. So let’s start by actually getting this new site into Github. First let’s initialize git locally.

```sh
> rm -rf .git
> git init
> git add .
> git commit -m 'initial commit'
```

Next you will want to go to [https://github.com/new](https://github.com/new) to add a new repo.

![github create repo](/images/posts/1_SS7izQ5-nZb4NXGL41sg6Q.webp "github create repo")

I called this repo `jta-mysite`, but you will want to name it whatever is appropriate for you. Now, let’s push it.

```sh
> git remote add origin git@github.com:judahtanthony/jta-mysite.git
> git push -u origin master
```

Obviously, swap out your Github username and repo.

## Setting up Netlify

Now that we have a working site in get, we are ready to deploy this site. Head over to [https://www.netlify.com/](https://www.netlify.com/), and signup for an account using Github authentication. The entry level plan is absolutely free and very generous.

Once you are logged in, you will want to create a new site by clicking the “New site from Git” button in the top right corner.

![new site from git](/images/posts/1_E0b7T3LdeO7JkjU7_ETa2w.webp "new site from git")

Then you can choose Github and grant it permission to access Github on your behalf. Now select the repo you just pushed to Github. Netlify will ask you for the branch and build command. You can specify `master` and `npm run build`, and the deploy directory is `public`.

After that, you can navigate to your site’s deploys tab and watch the build in action. When it is done, you will be able to see your new site hosted right there on a Netlify subdomain.

That’s it. Netlify will listen to your Github repository. It will pull down any changes, rebuild your site, and if everything pass, deploy it for you.

## Pull Request Previews

Developing in this new system is a breeze. Let’s say that your manager would like to change the “Hi people” message to “Hi ya’ll” (because who doesn’t like a little southern charm). While your `npm run develop` is still running, you can simply open the `/src/pages/index.js` file in your editor, change the greeting, and watch as Gatsby automagically detects the change, rebuilds your site, and hotloads the changes.

When you are ready for your manager to review your work, there is no need to call him/her over to your desk. Just break out a branch and create a Github pull request (PR).

```sh
> git checkout -b feature/warm-welcome
> git commit -am "Update greeting"
> git push --set-upstream origin feature/warm-welcome
```

After you have created the PR in Github you will notice a new set of checks.

![Netlify callbacks in Github](/images/posts/1_fiGFMw0zdx50rojp1JL_OQ.webp "Netlify callbacks in Github")

This is because when you created the site through Github, Netlify set up a set of webhooks that detects new PRs and auto generates a version of your site based on the proposed changes in the PR.

![Preview site](/images/posts/1_QO_zA3wBbCGe-kqauLn7JA.webp "Preview site")

Now you can just send your manager a link to this new site and s/he can do full UAT testing on a working replica of the whole site.

This is all just scratching the surface. I haven’t mentioned redirects, headers, proxying, authentication, or A/B testing. I encourage you to hit up [https://www.netlify.com/docs/](https://www.netlify.com/docs/) to see all that you get when you choose Netlify as your PaaS.
