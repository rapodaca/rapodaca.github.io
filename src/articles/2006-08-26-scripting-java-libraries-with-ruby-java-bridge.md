---
title: "Scripting Java Libraries with Ruby Java Bridge"
published: "2006-08-26T00:00:00.000Z"
---

Although <a href="http://jruby.codehaus.org/">JRuby</a> solves many Java/Ruby integration issues, in some cases it's not the right solution. One situation is when you want your Ruby code to use extensions written in C. The JRuby documentation makes very clear that this will never be supported. Another situation is if your code needs full access to <a href="http://jruby.codehaus.org/">Ruby on Rails</a>, or if your hosting service makes it difficult to configure JRuby on Rails. In these cases, JRuby's currently limited Rails support makes it a suboptimal choice.

<a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a> (RJB) is designed to solve these problems by letting Ruby developers manipulate Java libraries from Ruby. This gives you the ability to access C Ruby extensions <em>and</em> Java libraries in the same Ruby program. It also makes Rails integration a snap. Articles to follow will explore these two points. For now, let's see how how to get RJB working.

Installing Ruby Java Bridge is very simple. With root access:

```bash
sudo gem install rjb
```

This installs the Ruby Java Bridge gem. That's all there is to it.

Instantiating and using Java classes consists of the familiar process of first importing the class followed by creating a new instance:

```ruby
require 'rubygems'
require_gem 'rjb'
require 'rjb'

string_class = Rjb::import 'java.lang.String'
hello_string = string_class.new_with_sig('Ljava.lang.String;', 'hello')

p hello_string.toString # -> "hello"
```

Because an argument is passed to the constructor of the Java class, a special form needs to be used, <code>new_with_sig</code>. The "L" in front of the import statement indicates that the argument "hello" is a non-primitive datatype (i.e. class or interface).

Ruby Java Bridge offers some important advantages over JRuby. Subsequent articles will explore how these advantages can be used to quickly develop applications integrating chemical informatics libraries written in multiple languages.