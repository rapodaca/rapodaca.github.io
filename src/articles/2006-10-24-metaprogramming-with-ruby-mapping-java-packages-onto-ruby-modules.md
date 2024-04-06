---
title: "Metaprogramming with Ruby: Mapping Java Packages Onto Ruby Modules"
published: "2006-10-24T00:00:00.000Z"
---

</img><a href="http://www.vanderburg.org/Speaking/Stuff/oscon05.pdf">Metaprogramming</a> lets you define new constructs in your programming language. In <a href="http://www.journalhome.com/codecraft/9003/">safety languages</a> like Java, metaprogramming is not a standard feature, although <a href="http://www.csg.is.titech.ac.jp/~chiba/javassist/">it can be done</a>. Not surprisingly, the reaction most Java developers have to metaprogramming typically ranges from "useless" to "catastrophic". I was once in that category. But in the words of Paul Graham, sometimes doing the right thing involves <a href="http://www.paulgraham.com/progbot.html">"changing the language to suit the problem"</a>. This is a powerful concept that, when used with care, can greatly reduce development time. The Ruby language is <a href="http://ola-bini.blogspot.com/2006/09/ruby-metaprogramming-techniques.html">especially well-equipped</a> for metaprogramming. This article will show a simple metaprogramming technique that extends Ruby so that Java packages are mapped onto to Ruby modules.

# Prerequisites

This tutorial uses <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a> (RJB). RJB can be <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">installed</a> either on Windows or Linux using the <a href="http://rubygems.org/">RubyGems</a> packaging mechanism.

# Defining the Problem

The large amount of existing Java code makes RJB one of Ruby's most useful integration tools. RJB provides a lightweight mechanism for working with Java classes from Ruby, while simultaneously allowing for the use of C-extensions and everything else the C implementation of Ruby offers.

Let's say you'd like to do image processing with Java's <code>ImageIO</code> class. This could be accomplished with RJB via:

```ruby
require 'rubygems'
require_gem 'rjb'
require 'rjb'

@ImageIO = Rjb::import 'javax.imageio.ImageIO'

@ImageIO.getReaderFormatNames # => an array of format names
```

Here, the instance variable <code>ImageIO</code> holds a reference to the Java class of the same name. This isn't too bad, but can we do better?

Imagine a situation in which many Java classes need to be imported. This would lead to many variable assignments like the one above. The resulting duplications of Java class names and variable names <a href="http://www.dcs.gla.ac.uk/~hcp/psd/lectures/badsmells.pdf">doesn't smell especially good</a>, nor does it scale well. In addition, the large number of these variable assignments would add a lot of mental overhead when reading and writing the code.

What we'd really like is if Ruby had a way for us to map a Java package/class hierarchy onto Ruby module/class hierarchy. We could then forget about the differences between Ruby and Java, and just get to work. For example:

```ruby
#...

jrequire 'javax.imageio.ImageIO'

#...

Javax::Imageio::ImageIO.getReaderFormatNames
```

# A Solution

Our solution will involve translating nested Java package/class constructs into nested Ruby module/class constructs at runtime. We'll need the ability to create new module hierarchies in running code, one of the problems metaprogramming solves. We'll also have to deal with capitalization: Java package names are all lowercase, but Ruby module names start with a capital letter. So <code>java.lang.System</code> will become <code>Java::Lang::System</code>. By mapping the Java package namespace onto the Ruby module namespace, we'll reduce the odds of creating a Ruby/Java class name collision, such as with <code>java.lang.String</code>.

Let's create a small library to illustrate these points. The code will take advantage of Ruby's <code>const_set</code> method, which allows new constants (and therefore new modules and classes) to be defined at runtime. Save the following code into a file called <strong>java.rb</strong>:

```ruby
require 'rubygems'
require_gem 'rjb'
require 'rjb'

module Kernel

  def jrequire(qualified_class_name)
    java_class = Rjb::import(qualified_class_name)
    package_names = qualified_class_name.to_s.split('.')
    java_class_name = package_names.delete(package_names.last)
    new_module = self.class

    package_names.each do |package_name|
      module_name = package_name.capitalize

      if !new_module.const_defined?(module_name)
        new_module = new_module.const_set(module_name, Module.new)
      else
        new_module = new_module.const_get(module_name)
      end
    end

    return false if new_module.const_defined?(java_class_name)

    new_module.const_set(java_class_name, java_class)

    return true
  end
end  
```

# Usage

Using this library consists of <code>requiring</code> it, applying the new <code>jrequire</code> command, and manipulating the resulting class:

```ruby
require 'java'
jrequire 'javax.imageio.ImageIO'

Javax::Imageio::ImageIO.getReaderFormatNames # => ["BMP", "jpeg", "bmp", "wbmp", "gif", "JPG", "png", "jpg", "WBMP", "JPEG"]
```

You can eliminate the need to use the fully-qualified module name by adding an <code>include</code> statement, just as you would with any other Ruby module:

```ruby
require 'java'
jrequire 'javax.imageio.ImageIO'
include Javax::Imageio

ImageIO.getReaderFormatNames # => ["BMP", "jpeg", "bmp", "wbmp", "gif", "JPG", "png", "jpg", "WBMP", "JPEG"]
```

# One Possible Variation

An interesting variation on the approach given here would be to override Ruby's <code>require</code> method itself to accept fully-qualified Java class names. Then something even more Rubyesque could be used:

```ruby
require 'java'
require 'javax/imageio/ImageIO'

Javax::Imageio::ImageIO.getReaderFormatNames
```

# Other Examples of Ruby-Java Metaprogramming

<a href="http://ola-bini.blogspot.com/">Ola Bini</a> has written an article on JRuby metaprogramming that takes <a href="http://ola-bini.blogspot.com/2006/10/jruby-import.html">a slightly different approach</a> than the one detailed here.

# Conclusions

This tutorial has shown a simple and practical application of Ruby's built-in metaprogramming capabilities. The careful use of metaprogamming is a powerful way to reduce code complexity and build a more consistent programming environment. Look for more metaprogramming techniques to appear in future releases of the <a href="http://depth-first.com/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">Ruby CDK</a> library.