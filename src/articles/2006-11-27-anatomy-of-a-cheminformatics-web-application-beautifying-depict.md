---
title: "Anatomy of a Cheminformatics Web Application: Beautifying Depict"
published: "2006-11-27T00:00:00.000Z"
---

<a href="/articles/2006/11/21/build-a-rails-cheminformatics-application-in-thirty-minutes">A recent article</a> outlined the steps for building a <a href="http://rubyonrails.org">Rails</a> Web application that renders <a href="http://www.daylight.com/smiles/index.html">SMILES</a> strings as 2-D molecular images. Although this application, Depict, performed its stated purpose, it was neither much to look at nor as easy to use as it could be. In this tutorial, we'll give Depict a face-lift and make it more user-friendly.

# The Problem

As it now stands, Depict accepts a SMILES string as input, and then renders a new Web page containing a 2-D molecular image. We'd like to make it easier to enter multiple SMILES strings by combining data entry and image display into the same Web page. We'd also like to make the application as a whole look better by using <a href="http://www.w3.org/Style/CSS/">Cascading Style Sheets</a> and other UI enhancements.

# Download and Prerequisites

For this tutorial, you'll need <a href="/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0">Ruby CDK</a> (RCDK). A recent article described the small amount of system configuration required for <a href="/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">RCDK on Linux</a>. Another article showed how to install <a href="/articles/2006/10/12/running-ruby-java-bridge-on-windows">RCDK on Windows</a>.

In addition, you'll need to install <a href="http://www.rubyonrails.org/down">Ruby on Rails</a> - something that can be done through <a href="http://docs.rubygems.org/">RubyGems</a>.

The Rails application that this tutorial starts with can be downloaded from [this link](/images/posts/20061121/depict.tar.gz). If you'd rather work with the version of Depict produced by applying the changes outlined in this tutorial, the full source code can be downloaded from [this link](/images/posts/20061127/depict-20061127.tar.gz).

# Step 1: Consolidate Actions

Our first version of Depict defined three `SmilesController` actions: `input`; `depict`; and `image_for`. Because we want to show the molecular image on the same page on which SMILES input happens, we'll consolidate `input` and `depict` into a single action.

To do this, we'll edit `depict/app/controllers/smiles_controller.rb` by removing the `input` method and rewriting the `depict` and `image_for` methods:

```ruby
require_gem 'rcdk'
require 'rcdk/util'

jrequire 'java.io.ByteArrayOutputStream'
jrequire 'net.sf.structure.cdk.util.ImageKit'
jrequire 'javax.imageio.ImageIO'

class SmilesController < ApplicationController

  # Consolidated depict method.
  def depict
    if params[:smiles]
      @smiles = params[:smiles][:value]
    else
      @smiles = ''
    end
  end

  def image_for
    smiles = params[:smiles]

    # Just return if we can't get a SMILES string.
    if !smiles
      return
    end

    mol = RCDK::Util::Lang.read_smiles smiles
    mol = RCDK::Util::XY::coordinate_molecule mol
    out=Java::Io::ByteArrayOutputStream.new
    image=Net::Sf::Structure::Cdk::Util::ImageKit.createRenderedImage(mol, 300, 300)

    Javax::Imageio::ImageIO.write(image, "png", out)

    send_data(out.toByteArray, :type => "image/png", :disposition => "inline", :filename => "molecule.png")
  end
end  
```

We need to check whether the SMILES in `image_for` is `nil` because when the application is first lanched, no SMILES string is defined. By checking for this condition and exiting if found, our application can gracefully start up and respond to a blank input field.

We no longer need a View for the `input` action, the functionality of which we'll be moving into the View for our new `depict` action. Delete `depict/app/views/smiles/input.rhtml`, and edit `depict/app/view/smiles/depict.rhtml` so that is looks like the following:

```html
<html>
  <head>
    <title>Depict</title>
  </head>
  <body>
    <h1>Depict a SMILES String</h1>
    <img src=&quot;<%= url_for :action => &quot;image_for&quot;, :smiles => @smiles %>&quot;></img><br />

    <%= form_tag :action=>'depict' %>
      <label>SMILES: </label>
      <%= text_field('smiles', 'value', :value => @smiles) %><br />
    <%= end_form_tag %>
  </body>
</html>
```

This new template is simply a combination of the two previous templates. Pointing your browser to <a href="http://localhost:3000/smiles/depict">http://localhost:3000/smiles/depict</a> and entering a valid SMILES string should give a screen similar to the one below:

![Step 1.1](/images/posts/20061127/step_1_1.png "Step 1.1")

# Step 2: Add a Helper for Serving Images

If a blank or invalid SMILES is entered, we'd like to give feedback by loading an image that reflects this condition. The user is expecting to see an image anyway, so we may as well put our error message there. To do so, we need to first re-think our `image_for` action.

Currently, `image_for` tries to generate an image from any string of characters. When it fails, no image is produced, giving rise to the familar "broken image" icon below:

![Broken Image](/images/posts/20061127/broken_image.png "Broken Image")

We could add some conditional logic in our view that would detect an invalid or empty SMILES string. However, for several reasons such co-mingling of application code and HTML is generally considered a Bad Thing. Fortunately, Rails offers just what we need: Helpers. A helper is code contained in a module that is automatically included in a view.

Each Rails Controller comes complete with an associated Helper. Our SmilesHelper was already created and wired together for us when we created the `SmilesController`. All we need to do is to add our own Helper methods.

We're going to add a method called `image_for_smiles` that will return a URL to an image based on a SMILES string. It needs to handle three possible types of string input:

- Blank SMILES: Returns a static URL to an image on our server indicating no SMILES string has been entered. We'll discuss where to put this image in Step 5.
- Invalid SMILES: Returns a static URL to an image on our server indicating an invalid SMILES. We'll add this in Step 5.
- Valid SMILES: Returns a dynamic URL that will generate a 2-D molecular image on the fly from binary data generated in the same manner as our current `image_for` action.

Let's add the functionality we need to our `SmilesHelper`, which is contained in the file `depict/app/helpers/smiles_helper.rb`:

```ruby
require_gem 'rcdk'
require 'rcdk/util'

# New jrequire calls.
jrequire 'java.io.ByteArrayOutputStream'
jrequire 'net.sf.structure.cdk.util.ImageKit'
jrequire 'javax.imageio.ImageIO'

module SmilesHelper
  def image_for_smiles(param)
    smiles = param[:smiles]

    if smiles.eql? ''
      return '/images/blank.png'
    end

    render(smiles)
  end

  def render(smiles)
    begin    
      mol = RCDK::Util::Lang.read_smiles smiles
      mol = RCDK::Util::XY::coordinate_molecule mol
      image=Net::Sf::Structure::Cdk::Util::ImageKit.createRenderedImage(mol, 400, 400)
    rescue
      return '/images/invalid.png'
    end

    out = Java::Io::ByteArrayOutputStream.new

    Javax::Imageio::ImageIO.write(image, "png", out)

    flash[:bytes] = out.toByteArray
    flash[:smiles] = smiles

    url_for :action => 'image_for', :id => smiles
  end
end
```

Here, we introduce another Rails element - the flash. The flash provides temporary storage for data that needs to be passed from one Action to another. In the `render` method, we're storing the byte array created by Ruby CDK in the flash so that it can be sent into Depict's image window as dynamically-generated content.

If successful, the `render` method returns a URL of the form:

`http://localhost:3000/smiles/image_for/SMILES`

where `SMILES` is the escaped form of the user-specified SMILES string. If two images are served with exactly the same URL, some browsers (e.g., Konqueror) will assume they represent the same image and will re-use the image in their cache. So, we append the SMILES string to the URL as a way to get these browsers to refresh Depict's image area.

# Step 3: Invoke the New `image_for_smiles` Method

We've added a new `image_for_smiles` method as a Helper, but Depict isn't yet using it. Let's change that by modifying the way that our image URL is generated in `depict/app/views/smiles/depict.rhtml`:

```html
<html>
  <head>
    <title>Depict</title>
  </head>
  <body>
    <h1>Depict a SMILES String</h1>
    <img src=&quot;<%= image_for_smiles :smiles => @smiles %>&quot;></img><br />

    <%= form_tag :action=>'depict' %>
      <label>SMILES: </label>
      <%= text_field('smiles', 'value', :value => @smiles) %><br />
    <%= end_form_tag %>
  </body>
</html>
```

# Step 4: Simplify `SmilesController`

We're now no longer using `SmilesController` (`depict/app/controllers/smiles_controller.rb`) to perform the bulk of the work related to 2-D image generation. Let's update our Controller to reflect these changes:

```ruby
# No libraries need to be loaded now.

class SmilesController < ApplicationController
  # Consolidated depict method.
  def depict
    if params[:smiles]
      @smiles = params[:smiles][:value]
    else
      @smiles = ''
    end
  end

  # Consolidated image_for method.
  def image_for
    if flash[:bytes]
      send_data(flash[:bytes], :type => "image/png", :disposition => "inline", :filename => "#{flash[:smiles]}.png")
    end
  end
end
```

Notice how much simpler the `image_for` method now is. The byte array saved in Rails' flash (introduced in Step 2) is simply sent out as a PNG image to any receiver requesting it.

Our application, when provided with a valid SMILES string, now looks like the image below.

![Step 4.1](/images/posts/20061127/step_4_1.png "Step 4.1")

# Step 5: Add Static Images

We'd like to have Depict render an appropriate image in those cases where a molecular image can not be rendered. In fact, Depict is already configured to do so - all we need to do is add the images themselves.

Where do we put these images? Rails creates several directories when an application template is produced. One of these is called `public`. This directory in turn contains an `images` subdirectory. Currently, `depict/public/images` only contains the Rails logo. It is this directory into which static images are designed to go. Let's add these two images to `depict/public/images`: [blank.png](/images/posts/20061127/blank.png) and [invalid.png](/images/posts/20061127/invalid.png). You could, of course, create your own custom 400x400 pixel images for this purpose.

Deleting any SMILES input from Depict now should generate the screen shown below.

![Step 5.1](/images/posts/20061127/step_5_1.png "Step 5.1")

Not exactly subtle, but it gets the message across. A similar screen results by entering an invalid SMILES string, such as "hello".

# Step 6: Create and Use a Cascading Style Sheet

We'd like to have fine-grained control over the appearance of our application through a single file - a job ideally suited for Cascading Style Sheets (CSS). Where do CSS files live in a Rails application? Along with the `images` directory described above, Rails also creates a `public/stylesheets` directory when an application template is generated. This is where custom style sheets can be placed. Create a CSS file called `default.css` in this directory containing the following definitions:

```css
h1 {
    text-align: center;
    font-size: 30pt;
    background: #993333;
    color: white;
}

.image {
    margin-left: auto;
    margin-right: auto;
    width: 400px;
}

.smiles {
    margin-left: auto;
    margin-right: auto;
    width: 400px;
}

.smiles input {
    width: 100%;
    font-size: 18pt;
    text-align: center;
    border: solid #993333;
    border-width: 2px 2px 2px 2px;
}

.smiles label {
    background: #993333;
    color: white;
    padding: 4px;
    font: sans-serif;
    font-weight: bold;
}

.about {
    text-align: center;
    font-size: 16pt;
}

a:link,  a:visited { color: #930; }
a:hover, a:active {color: #FFFFFF; background: #993333;}
```

Next, we need to tell Rails where to find the above CSS. Open up `depict/app/views/smiles/depict.rhtml` and add the following eRuby line inside the `head` tags:

```html
<%= stylesheet_link_tag "default", :media => "all" %>
```

That's all there is to it. Reloading Depict should give a screen similar to the one below.

![Step 6.1](/images/posts/20061127/step_6_1.png "Step 6.1")

# Step 7: Clean Up the View

You may have noticed that the style sheet added in the previous step defines some features we're not currently using. Let's update Depict's View (`depict/app/views/depict.rhtml`) to reflect the changes to our CSS:

```html
<html>
  <head>
    <title>Depict</title>
    <%= stylesheet_link_tag &quot;default&quot;, :media => &quot;all&quot; %>
  </head>
  <body>
    <h1>Depict a SMILES String</h1>
    <div class=&quot;image&quot;>
      <img src=&quot;<%= image_for_smiles :smiles => @smiles %>&quot;></img>
    </div>
    <br /><br />
      <div class=&quot;smiles&quot;>
      <%= form_tag :action=>'depict' %>
        <label>SMILES: </label>
        <%= text_field('smiles', 'value', :align=>'center', :value => @smiles) %><br />
      <%= end_form_tag %>
      </div>
  </body>

  <div class=&quot;about&quot;>
    <a href=&quot;/articles/2006/11/27/anatomy-of-a-cheminformatics-web-application-beautifying-depict&quot;>About this Application</a>
  </div>
</html>
```

The changes here consist of grouping related HTML elements together into `div` blocks and adding a link to the article you're reading at the bottom of the article. The interaction of the above code and the style sheet we created in Step 6 produces a screen, such as the one below, when a valid SMILES string is entered.

![Step 7.1](/images/posts/20061127/step_7_1.png "Step 7.1")

# Summary

Even if you haven't followed along through this tutorial, it should be apparent that Rails is a powerful tool for the agile development of Web applications. Although we haven't used any sophisticated techniques, we now have a working Depict server with a simple, logical Web interface that does something useful.

But we're not quite done with Depict yet. Currently, you need to hit the return key to get a 2-D rendering. Wouldn't it be better if the application automatically updated the image as a SMILES string is typed? If you're thinking "Ajax", you're right on target.