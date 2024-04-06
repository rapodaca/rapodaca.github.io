---
title: "Scripting Java with Ruby: Yet Another Java Bridge"
published: "2006-10-25T00:00:00.000Z"
---

New technologies attempting to compete with older technologies need to provide a clear upgrade path, if they are to succeed. A case in point is Ruby. Many Java developers' reaction to this language has less to do with its capabilities and more to do with previous investments in Java. What good is a new language if the special library X that you depend on needs to be rewritten from scratch?

Previous articles, starting with <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">this one</a>, have discussed <a href="http://rjb.rubyforge.org">Ruby Java Bridge</a> (RJB) as a Java-Ruby integration tool. Two additional articles discussed RJB in the context of <a href="http://depth-first.com/articles/2006/10/24/metaprogramming-with-ruby-mapping-java-packages-onto-ruby-modules">mapping Java packages onto Ruby modules</a> and <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">Java-Ruby integration on Windows</a>. RJB currently provides the mechanism whereby the full <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK) API can be used in Ruby with <a href="http://rubyforge.org/projects/rcdk">Ruby CDK</a>.

Another option for Java-Ruby integration is <a href="http://jruby.codehaus.org/">JRuby</a>, a Java implementation of the Ruby interpreter. JRuby offers tight integration with the Java Virtual Machine, which will be ideal in many situations. In other situations, it will not be the best choice. For example, one of the advantages of RJB over JRuby is that the standard C-Ruby implementation can be used. This in turn offers, for example, full <a href="http://www.rubyonrails.org/">Rails</a> functionality and access to C extensions. A disadvantage of RJB is that, being written in C, it requires a working build toolchain for installation.

I've seen <a href="http://www.jaredrichardson.net/blog/2006/09/01/">one report</a> of a Macintosh installation of RJB that failed. Without a Mac of my own, I can't confirm if this is indeed a problem. But this report also pointed me to a third approach to Ruby-Java integration, <a href="http://www.cmt.phys.kyushu-u.ac.jp/~M.Sakurai/cgi-bin/fw/wiki.cgi?page=YAJB">Yet Another Java Bridge</a> (YAJB). YAJB is different from both JRuby and RJB in that it extends the C implementation of Ruby with a Java bridge written in pure Java. In theory, it should run on any platform that both Ruby and Java run on.

<a href="http://www.cmt.phys.kyushu-u.ac.jp/~M.Sakurai/java/ruby/yajb-0.8.1.tar.gz">YAJB-0.8.1</a> installed on my system without a hitch. From the root directory of the distribution:

```bash
ruby setup.rb
```

Using YAJB was straightforward. A Java <code>Vector</code> instance could be instantiated and manipulated using familiar syntax:

```ruby
require 'yajb/jbridge'
include JavaBridge

v = jnew "java.util.Vector"

v.add("one")
v.add("two")
v.size # => 2
v.elementAt(1) # => "two"
```

Good integration tools can make the difference between actually using new technologies and simply observing them. Java developers interested in using Ruby now have at least three good options to choose from: JRuby; RJB; and YAJB.