---
title: Merb on JRuby
published: "2009-01-09T00:00:00.000Z"
---

[My company](http://metamolecular.com/) is developing a commercial cheminformatics Web application with Ruby on Rails. Due to the nature of the problem domain, this application will require interaction with [MX](http://code.google.com/p/mx-java), an essential cheminformatics library written in Java.

This article will first explain how and why Merb entered the picture and then explain how to get Merb installed on a clean JRuby-1.1.6 installation.

# JRuby on Rails: Express-Service Deployment, but a Trainwreck for Development

The initial approach, [JRuby on Rails](http://wiki.jruby.org/wiki/JRuby_on_Rails) works amazingly well for deployment (especially using [Glassfish and Warbler](http://blog.headius.com/2008/08/zero-to-production-in-15-minutes.html)), but is nothing but heartache for development and testing. My biggest complaints include:

-  **Startup time is prohibitively slow.** It typically takes anywhere from 10 to 15 seconds for JRuby and the Rails environment to completely load on my system. This leads to the next point...
-  **RSpec on JRuby: FAIL** 10-15 seconds startup time may not sound like a big deal, but consider that in [Behavior Driven Development](http://dannorth.net/introducing-bdd) with [RSpec](http://rspec.info/) you don't even begin writing application code until you first write a failing test, then watch it fail, then write a small bit of code to make the test pass, then write another test, and so on. At every point in this process, you need to wait 10-15 seconds (compared to 1-2 seconds on MRI) for JRuby and Rails to startup up. All of which leads to a lot of waiting around and all of which is anything but Agile.
-  **Autospec on JRuby: FAIL** [Autospec](http://www.nateclark.com/articles/2008/09/17/_autotest_-is-now-_autospec_-how-to-set-up-autospec-for-rspec-and-rails-with-zentest) runs in the background, constantly monitoring modifications to your project and automatically running tests. It's a wonderful idea that, that once you've tried it, will make it very difficult to go back to manually running tests. The problem is that Autospec is broken on JRuby: (1) [rspec only runs by monkeypatching the startup scripts](http://jira.codehaus.org/browse/JRUBY-3284) and then dies when the first failing test is run; (2) [spec_server doesn't work](http://jira.codehaus.org/browse/JRUBY-3283).

# One Solution: Encapsulate Java Dependency in Web Service with Merb on JRuby

Given that the interaction with the MX library actually affects very little of the Rails application, one possibility would be to factor out this functionality into a private Web serivice. One way to do that would be with [Merb](http://merbivore.com/) on JRuby. At that point, the Rails application could be run under [MRI](http://en.wikipedia.org/wiki/Ruby_MRI) for development and testing, and under JRuby for deployment.

For the unfamiliar, Merb is a lightweight, fast, MVC framework for Ruby ideal for building simple, restful Web services.

# Installing Merb on JRuby

Despite reaching the version 1.0 milestone, getting specific information on installing Merb under non-standard platforms like JRuby is not easy. My solution was based on information provided by [Arun Gupta](http://blogs.sun.com/arungupta/) in [a recent article](http://blogs.sun.com/arungupta/entry/totd_53_scaffold_in_merb).

Starting with a clean installation of JRuby-1.6, here's what worked for me:

```bash
jruby -S gem install merb-core --no-ri --no-rdoc
jruby -S gem install merb-more --no-ri --no-rdoc
jruby -S gem install activerecord --no-ri --no-rdoc
jruby -S gem install merb_activerecord --no-ri --no-rdoc
jruby -S gem install mongrel --no-ri --no-rdoc
```

The problem we need to solve is that trying to install the full Merb metagem itself will complain due to a dependency on DataMapper, which uses native extensions and is not yet available for JRuby, so you'll get something like this if you try:

```bash
jruby -S gem install merb --no-ri --no-rdoc
Building native extensions.  This could take a while...
/home/rich/local/jruby-1.1.5/lib/ruby/1.8/mkmf.rb:7: JRuby does not support native extensions. Check wiki.jruby.org for alternatives. (NotImplementedError)
	from /home/rich/local/jruby-1.1.5/lib/ruby/1.8/mkmf.rb:21:in `require'
	from extconf.rb:21
ERROR:  Error installing merb:
	ERROR: Failed to build gem native extension.

/home/rich/local/jruby-1.1.5/bin/jruby extconf.rb install merb --no-ri --no-rdoc

Gem files will remain installed in /home/rich/local/jruby-1.1.5/lib/ruby/gems/1.8/gems/do_sqlite3-0.9.10.1 for inspection.
Results logged to /home/rich/local/jruby-1.1.5/lib/ruby/gems/1.8/gems/do_sqlite3-0.9.10.1/ext/do_sqlite3_ext/gem_make.out
```

Installing only merb-core and merb-more along with ActiveRecord and Mongrel gives us everything we need to create a simple Merb on JRuby application.

# A Simple Merb on JRuby Application

We need to tell Merb to use ActiveRecord as the ORM rather than DataMapper when the project is created. Let's call our project 'ws':

```bash
jruby -S merb-gen core --orm activerecord ws
cd ws
jruby -S rake db:create
nano config/database.yml.sample ...
mv config/database.yml.sample config/database.yml
jruby -S merb
```

Pointing your browser at [http://localhost:4000/](http://localhost:4000/) should render a page. It will complain about "No routes match the request: /", but that's to be expected since we haven't created any.

# Conclusions

Merb isn't the only way to create a fast, private, restful web service for accessing Java libraries. One alternative would be to use a pure-Java solution such as [Restlet](http://www.restlet.org/). Still, with Merb on JRuby installed and running, it's possible to explore the tradeoffs. And the coming [merge](http://weblog.rubyonrails.org/2008/12/23/merb-gets-merged-into-rails-3) of Merb and Rails for Rails 3.0 makes doing so all the more compelling.