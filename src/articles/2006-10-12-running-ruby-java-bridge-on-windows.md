---
title: "Running Ruby Java Bridge on Windows"
published: "2006-10-12T00:00:00.000Z"
---

The <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a> (RJB) is one of the most useful Ruby integration packages available. For example, RJB enables the complete use of the Chemistry Development Kit (CDK) <a href="http://depth-first.com/articles/2006/09/14/cdk-the-ruby-way">from within Ruby</a>. Past articles have been written from a  unix-centric perspective. This article will show how Windows users can  join in the fun.

# Prerequisites 

The only software you'll need for this tutorial is <a href="http://java.sun.com/javase/downloads/index.jsp">Sun's Java Development Kit</a> (JDK).  RJB requires the JDK and won't work with Sun's Java Runtime Environment (JRE).

# Install Ruby and RJB

The simplest way to get started with Ruby on Windows is to download and install the <a href="http://rubyinstaller.rubyforge.org/wiki/wiki.pl">Ruby One-Click Installer</a>. Be sure RubyGems support is enabled.

Once Ruby is installed, RJB can then be installed by using the RubyGems packaging system (from a dos prompt - see below):

```bash
sudo gem install rjb
```

Choose the most recent Win32 version (1.0.2 at the time of this writing). This will automatically compile and install RJB on your system.

If you'd like, now would be a good time to also install Ruby CDK (rcdk):

```bash
gem install rcdk
```

# Post-Install Configuration

You'll need to make sure your system's <code>JAVA_HOME</code> environment variable points to your JDK installation. If you're running Windows XP, a convenient way to do so is to use Start->Control Panel->(Switch to Classic View)->System->Advanced Tab->Environment Variables. Add a new variable called <code>JAVA_HOME</code> with the path to the JDK installation as a value. On my system, this path is <strong>C:\Program Files\Java\JDK1.5.0_09</strong>. Simply installing JDK does not set your system's <code>JAVA_HOME</code> environment variable.

# Testing RJB

You can verify that RJB is installed and working as described in <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">my previous article on RJB</a>. A command line prompt can be obtained in Windows XP through Start->Run followed by typing <strong>command.com</strong> and enter. The screenshot below shows RJB working via IRB:

![Ruby RJB](/images/posts/20061012/ruby_rjb.png)

# Summing Up

Using Ruby and RJB on Windows is not that much different than doing so on unix. With this background, future articles will return to the theme of Ruby's role in chemical informatics software integration.