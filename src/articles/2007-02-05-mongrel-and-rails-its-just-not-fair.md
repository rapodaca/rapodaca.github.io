---
title: "Mongrel and Rails: It's Just not Fair"
published: "2007-02-05T00:00:00.000Z"
---

<a href="http://www.rubyonrails.org/">Rails</a> excels as a rapid Web development platform. Deployment of Rails applications, on the other hand, has until recently been a lot less rapid and a lot more complicated. A new Rails technology called <a href="http://mongrel.rubyforge.org/index.html">Mongrel</a> is now set to change all of that.

Mongrel is a fast Rails application container. It can be used in standalone mode - exactly like <a href="http://www.webrick.org/">WEBrick</a>. For hassle-free scaling, your Rails application can also be run on multiple Mongrel instances (either located on the same server or on multiple servers) behind a load balancer such as <a href="http://siag.nu/pen/">Pen</a>, <a href="http://www.inlab.de/balance.html">Balance</a>, or <a href="http://httpd.apache.org/">Apache 2.1+</a>. Using Mongrel is very simple: it's packaged as a Ruby Gem and requires minimal configuration. Mongrel is also stable (Version 1.0 was just released), actively maintained (unlike <a href="http://www.lighttpd.net/">lighttpd</a>), and apparently quite secure.

What does this have to do with cheminformatics? Quite a lot if you, like me, see the Web as the <a href="http://depth-first.com/articles/2006/11/20/unchaining-chemistry-from-the-desktop">ideal platform</a> for developing cheminformatics applications. Sure, a lot of technologies will need to be created first. But this is just another way of underscoring the big opportunities ahead. Future articles will discuss some of them.