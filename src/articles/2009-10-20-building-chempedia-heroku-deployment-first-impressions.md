---
title: Building Chempedia - Heroku Deployment First Impressions
published: "2009-10-20T00:00:00.000Z"
---

One of the most important decisions we faced in the re-launch of [Chempedia](http://chempedia.com) was how to deploy it. Although deployment tends not to get the attention that Web application development gets, it's every bit as important in determining how the fruits of your labors are perceived by end users.

[Heroku](http://heroku.com) is a Rails application deployment platform that's unique for its laser focus on scalability and ease of use. Heroku enables application development teams to [forget about servers](http://heroku.com/how/architecture) and focus on building great applications. Heroku provides a well-crafted abstraction layer on top of [Amazon's Elastic Compute Cloud](http://aws.amazon.com/ec2/) (EC2) that offers a much better mental map for how an application should interact with its deployment environment.

For the re-launch of Chempedia, we've decided to try Heroku, in part based on an [excellent presentation by Heroku at SD Ruby](/articles/2009/10/02/tech-fridays-deploying-rails-and-rack-applications-with-heroku) and the [unbeatable price](/articles/2009/10/02/tech-fridays-deploying-rails-and-rack-applications-with-heroku) - free for a minimal setup!

I've been quite impressed with Heroku so far, but there have been some gotchas along the way. Most of them relate to the fact that Heroku has eliminated a lot of choices (and therefore complexity) from the deploy process. Here, in no particular order are some initial findings:

-  Deployment really is as easy as advertised. It took all of about 90 minutes to go from a local development version of Chempedia to one hosted on Heroku. A simple git push is all it takes to deploy. And a single heroku rake call is all it takes to perform database migration.
-  You'll be running PostreSQL - period. At [Metamolecular](http://metamolecular.com), we've standardized on MySQL. If your application was also developed and tested with MySQL, you'll need to be aware of the differences between the two, such as [case-sensitive queries](http://stackoverflow.com/questions/203399/how-do-you-write-a-case-insensitive-query-for-both-mysql-and-postgres).
-  The filesystem is read-only. This has a number of important consequences. For example, Chempedia generates *a lot* of images. These can't be cached on the local filesystem in the way we've done before. Instead, we need to rely either on straight HTTP caching, or better, on [Amazon S3](http://aws.amazon.com/s3/).
-  Use config vars. One problem with a git-only deployment system is what to do with all of those private configuration settings such as usernames and passwords for third-party web services. Heroku's answer is [config variables](http://docs.heroku.com/config-vars), a system that's quite easy to implement, provided that you're aware of it.
-  No local fragment caching. Another important consequence of a read-only filesystem is that local fragment caching is not possible. Currently Heroku offers a beta for [memcached](http://heroku.com/pricing#blossom-1) that I'm hoping to get access to.
-  No Sphinx. Chempedia allows users to submit text-searches to locate substances. A natural solution to this problem was [Sphinx](http://www.sphinxsearch.com/). Unfortunately, Sphinx is not supported by Heroku. Although both Ferret and Solr are, both have important limitations. Fortunately, a workaround was feasible by changing the Chempedia code. Here's hoping that Sphinx is supported on Heroku soon.
-  HTTP caching just works. Set the headers and you're done. Heroku uses [Varnish](http://varnish.projects.linpro.no/) as its high-performance [reverse proxy cache](http://railslab.newrelic.com/2009/02/26/episode-11-advanced-http-caching). This works for general-purpose pages, but anything displaying a username and/or reputation score (as Chempedia does) requires fragment caching. Thus, the need for [memcached](http://www.danga.com/memcached/).
-  Restricted access to application log. Although it's possible to read the last few entries from the production log file, I've found no way to extend the length of what's returned.
-  Random system outages. This one was surprising. Twice so far it's been necessary to create a ticket because the Chempedia testing instance wasn't responding. Fortunately, both times the resolution of the problem took less than 15 minutes. With access to more of the log file, it might be possible to find out whether the problem lies with the Chempedia code or Heroku; so far the jury's still out.

Most of the problems we've faced with Chempedia on Heroku were addressable with minimal effort. All in all, the tradeoffs have so far been worth it.

# About Chempedia

[Chempedia](http://chempedia.com) is the free and open chemical substance registry. Embracing both peer-review and the best practices of new social media, Chempedia offers a modern platform for the next generation of Web-based chemistry applications. We continue to look for testers during the re-design of Chempedia; if you're interested in taking a peek, please [drop us a line](http://metamolecular.com/contact).