---
title: Scripting Octet with JRuby
published: "2006-08-23T00:00:00.000Z"
---

<a href="http://jruby.codehaus.org/">JRuby</a> is a Java implementation of the Ruby language. It lets developers manipulate Java classes and objects using Ruby syntax. Why would anybody want to do this? One reason is to enable Ruby developers to work with 'legacy' Java code. Another less obvious reason it that Java classes and objects can manipulated interactively with the JRuby version of <a href="http://tryruby.hobix.com/">Interactive Ruby</a>, or irb. Still another is to provide new avenues for application development and deployment. In this article, I'll show how <a href="http://sf.net/projects/octet">Octet</a> can be scripted with JRuby.