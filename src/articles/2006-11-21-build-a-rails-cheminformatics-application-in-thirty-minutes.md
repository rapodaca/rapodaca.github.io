---
title: "Build a Rails Cheminformatics Application in Thirty Minutes"
published: "2006-11-21T00:00:00.000Z"
---

A <a href="http://depth-first.com/articles/2006/11/20/unchaining-chemistry-from-the-desktop">recent article</a> highlighted the Web as a new cheminformatics platform. Advocacy is one thing, but a working, open, demo built with modern technologies is far more compelling. In the following tutorial we'll build a first-generation cheminformatics Web application using the <a href="http://www.rubyonrails.org/">Ruby on Rails</a> framework and 100% Open Source components. We'll just cover the essentials here - look for future articles to discuss the underlying technology in more detail.

# The Problem

<a href="http://www.daylight.com/smiles/index.html">Simplified Molecular Input Line Entry System</a> (SMILES) is one of the most compact and easy-to-learn molecular representation systems ever developed. Part of a larger family of molecular languages called <a href="http://depth-first.com/articles/2006/08/18/107-years-of-line-formula-notations-1861-1968">line notations</a>, SMILES strings are always written as a single line of ASCII text. This makes them perfect in situations calling for data entry; witness their use in a wide range of new free <a href="http://depth-first.com/articles/2006/11/07/twelve-free-chemistry-databases">online chemistry databases</a>. This system typically works by a chemist drawing a structure in a graphical editor, copying a SMILES string from the editor, and pasting this string into a search window in the database application.

SMILES is a great language for computers, but not for chemists, who are trained to communicate through 2-D structure diagrams. Although SMILES strings can be decoded manually, this is a tedious and error-prone process, especially for SMILES encoding high degrees of branching and ring content. It's preferable for the computer to do this hard work for us, providing a perfectly laid-out 2-D structure diagram for use in debugging or inclusion in documents.

<a href="http://www.daylight.com/daycgi/depict">Depict</a> is a Web application originally developed by <a href="http://www.daylight.com/">Daylight</a> for the conversion of SMILES strings into 2-D structure diagrams. Type a SMILES string into the form, press enter, and get a raster image of the encoded molecule. Daylight's Depict does a good enough job, but you can't change the interface or output. You also can't take the software apart to see how it works. Wouldn't it be great if you could?

# About This Tutorial Series

This tutorial is the first in a series describing how to build a Depict server using 100% <a href="http://opensource.org">Open Source</a> components. The application will accept a SMILES string in a Webpage text field, and then produce a 2-D structure diagram. It won't be designed for ease of use, appearance, or configurability - these improvements will be described in subsequent articles. When this application is finished, I'll deploy it on a Web server. At every step in this process, I'll provide enough detail for anyone to do the same.

It won't be necessary to finish every step yourself before you can work with the finished product. Near the beginning of each installment will be be a "Download and Prerequisites" section containing a link to the complete source code. Simply download this code and run it to see what it does.

# Download and Prerequisites

For this tutorial, you'll need <a href="http://depth-first.com/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0">Ruby CDK</a> (RCDK). A recent article described the small amount of system configuration required for <a href="http://depth-first.com/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">RCDK on Linux</a>. Another article showed how to install <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">RCDK on Windows</a>.

In addition, you'll need to install <a href="http://www.rubyonrails.org/down">Ruby on Rails</a> - something that can be done through <a href="http://docs.rubygems.org/">RubyGems</a>.

The complete Depict application can be [downloaded from this link](/images/posts/20061121/depict.tar.gz).

# A Note on Ruby Java Bridge and AMD64 Linux Platforms

Our Depict application will use <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a> (RJB) as a Ruby interface to Java bytecode. Recently, <a href="http://rubyforge.org/pipermail/rjb-users/2006-November/000008.html">a problem with RJB on AMD64-Linux</a> was uncovered. This problem prevents third-party jarfiles from being loaded after Rails has been loaded.

In practice, this means that the command to start the Rails server (Step 2) needs to be prefixed with an assignment of <code>LD_PRELOAD</code>. You also need to make <code>LD_LIBRARY_PATH</code> point to your native Java libraries. On my platform, which is AMD64-Linux running Sun's JVM, the commands are:

```bash
export LD_LIBRARY_PATH=/usr/java/jdk1.5.0_09/jre/lib/amd64:/usr/java/jdk1.5.0_09/jre/lib/amd64/server
LD_PRELOAD=/usr/java/jdk1.5.0_09/jre/lib/amd64/libzip.so ruby script/server
```

If you get an "Internal Error" due to an "unknown exception" while running Depict, chances are good that you've hit the same problem. Starting the Rails server as above should resolve it.

# Step 1: Create the Application

Getting started with Rails is as simple as issuing the <code>rails</code> command with the name of your application as an argument:

```bash
rails depict
```

Executing this command creates a complete Rails application template under the <strong>depict</strong> subdirectory in your working directory. You build your application by editing the files and directories that were generated.

# Step 2: Start the Server

You can start the Depict application by running the included server script:

```bash
$ cd depict
$ ruby script/server
=> Booting WEBrick...
=> Rails application started on http://0.0.0.0:3000
=> Ctrl-C to shutdown server; call with --help for options
[2006-11-18 10:17:08] INFO  WEBrick 1.3.1
[2006-11-18 10:17:08] INFO  ruby 1.8.5 (2006-08-25) [x86_64-linux-gnu]
[2006-11-18 10:17:08] INFO  WEBrick::HTTPServer#start: pid=4036 port=3000
```

Let's see what Depict looks like so far. Point your browser to <a href="http://localhost:3000">http://localhost:3000</a>. You should see the following page:

![Step 2](/images/posts/20061122/step_2.png "Step 2")

Congratulations! You're now running Ruby on Rails.

# Step 3: Create the SmilesController

Rails adapts the Model-View-Controller application paradigm to the Web. It also automates many of the steps in building models, views, and controllers. Let's create a controller to handle the manipulation of SMILES strings:

```bash
ruby script/generate controller Smiles
    exists  app/controllers/
    exists  app/helpers/
    create  app/views/smiles
    exists  test/functional/
    create  app/controllers/smiles_controller.rb
    create  test/functional/smiles_controller_test.rb
    create  app/helpers/smiles_helper.rb
```

Currently, <code>SmilesController</code> is just a skeleton:

```ruby
class SmilesController < ApplicationController
end
```

Let's give <code>SmilesController</code> the ability to accept a SMILES string as input by adding an <code>input</code> method.

```ruby
class SmilesController < ApplicationController
  def input

  end
end
```

# Step 4: Create a Form

At this stage, pointing your browser to <a href="http://localhost:3000/smiles/input">http://localhost:3000/smiles/input</a> gives a screen containing an error message:

![Step 4.1](/images/posts/20061122/step_4_1.png "Step 4.1")

Rails is looking for view that doesn't exist, so let's create one. To your <strong>depict/app/views/smiles</strong> directory, add the following file, called <strong>input.rhtml</strong>:

```html
<html>
  <head>
    <title>Enter a SMILES String</title>
  </head>
  <body>
    <%= form_tag :action=>'depict' %>
      Enter a SMILES String: <br />
      <%= text_field('smiles', 'value') %><br />
    <%= end_form_tag %>
  </body>
</html>
```

This HTML view is an example of Ruby's templating mechanism, eRuby, which was discussed earlier in the context of <a href="http://depth-first.com/articles/2006/11/15/diversity-oriented-chemical-informatics">converting SD files to HTML</a>. In the template above, we've configured our form to invoke an action called <code>depict</code> when submitted. This action does not yet exist, but will be created in Step 5 below.

Now, pointing your browser to <a href="http://localhost:3000/smiles/input">http://localhost:3000/smiles/input</a> should give an input field:

![Step 4.2](/images/posts/20061122/step_4_2.png "Step 42.")

Let's try it. Submitting the SMILES string for benzene gives the following error screen:

![Step 4.3](/images/posts/20061122/step_4_3.png "Step 4.3")

We haven't defined the <code>depict</code> action yet, a fact that Rails is communicating with this error message.

Have you noticed how we haven't had to restart the Rails Web server as we've made changes? This is but one of the many conveniences that makes Rails such a productive platform.

# Step 5: Add a Depict Action

We need a way to pass a SMILES string from the Web page text field in which it's entered to our application and back to another view. To do this we'll add a <code>depict</code> method to <strong>depict/app/controllers/smiles_controller.rb</strong>:

```ruby
def depict
  @smiles = @params[:smiles][:value]
end
```

Of course, our application still won't run properly because we haven't created a view for the new <code>depict</code> method to use. Let's do this by adding the following file, named <strong>depict.rb</strong> to the <strong>depict/app/views/smiles</strong> directory:

```html
<html>
  <head>
    <title>Depict SMILES: <%= @smiles %></title>
  </head>
  <body>
    <h1>SMILES: <%= @smiles %></h1>
  </body>
</html>
```

Notice how the instance variable <code>@smiles</code> is available for use within the template.

Let's have a look at Depict so far. Pointing your browser to <a href="http://localhost:3000/smiles/input">http://localhost:3000/smiles/input</a>, entering the SMILES string for benzene, and pressing return produces the page show below:

![Step 5.1](/images/posts/20061122/step_5_1.png "Step 5.1")

So far, so good. We've been able to read user input from an HTML form and reprocess it into some simple HTML output. Now, lets render a 2-D molecular image to go with it.

# Step 6: Generate the 2-D Image

We'll use a method called <code>image_for</code>, which we'll define shortly. The file <strong>depict/app/views/smiles/depict</strong> should look like this:

```html
<html>
  <head>
    <title>Depict SMILES: <%= @smiles %></title>
  </head>
  <body>
    <h1>SMILES:<%= @smiles %></h1>
    <img src="<%= url_for :action => "image_for", :smiles => @smiles %>"></img>
  </body>
</html>
```

The added <code>img</code> tag is a placeholder for now. It loads an image dynamically generated from the <code>image_for</code> method, which we'll shortly add to <code>SmilesController</code>. We pass the SMILES string as a parameter.

The <code>image_for</code> method does all of the real work in the Depict application. It accepts a SMILES string as a parameter, and produces a laid-out 2-D color molecular image as output. The method uses a variety of functionality contained in the Java API itself, and in Ruby CDK.

In addition to an <code>image_for</code> method, we'll need to add some accessory code to make it work. Edit <strong>depict/app/controllers/smiles_controller.rb</strong> so that it looks like this:

```ruby
# Load the RCDK library
require_gem 'rcdk'
require 'rcdk/util'

# New jrequire calls.
jrequire 'java.io.ByteArrayOutputStream'
jrequire 'net.sf.structure.cdk.util.ImageKit'
jrequire 'javax.imageio.ImageIO'

class SmilesController < ApplicationController

  # Already defined.
  def input

  end

  # Already defined.
  def depict
    @smiles = @params[:smiles][:value]
  end

  # New method.
  def image_for
    smiles = @params[:smiles]
    mol = RCDK::Util::Lang.read_smiles smiles
    mol = RCDK::Util::XY::coordinate_molecule mol
    out=Java::Io::ByteArrayOutputStream.new
    image=Net::Sf::Structure::Cdk::Util::ImageKit.createRenderedImage(mol, 300, 300)

    Javax::Imageio::ImageIO.write(image, "png", out)

    send_data(out.toByteArray, :type => "image/png", :disposition => "inline", :filename => "molecule.png")
  end
end
```

Let's test the application with a real-world example. The achiral SMILES string for <a href="http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=14950">Carmine</a> is:

`CC1=C2C(=CC(=C1C(=O)O)O)C(=O)C3=C(C2=O)C(=C(C(=C3O)O)C4C(C(C(C(O4)CO)O)O)O)O`

Pointing your browser to <a href="http://localhost:3000/smiles/input">http://localhost:3000/smiles/input</a> and entering the above SMILES string produces a color 2-D image of the structure of the red food coloring:

![Step 6.1](/images/posts/20061122/step_6_1.png "Step 6.1")

# Conclusions

Ruby on Rails is a fun and agile framework for rapid Web development. Although Depict isn't much to look at yet, it demonstrates many key Rails concepts. Several techniques could be used improve the application's look and usability. For example, we could use <a href="http://www.ajaxian.com/">AJAX</a> to depict SMILES strings as they are being typed - without the need to hit return. We could also provide options for changing image format, size, and color scheme. Future articles will describe these and other improvements.