---
title: "Anatomy of a Cheminformatics Web Application: Ajaxifying Depict"
published: "2006-12-04T00:00:00.000Z"
---

The <a href="http://depth-first.com/articles/2006/11/27/anatomy-of-a-cheminformatics-web-application-beautifying-depict">previous tutorial in this series</a> showed some techniques for improving the appearance and usability of a simple cheminformatics Web application. That application, Depict, rendered color images of 2-D molecular structures when given a SMILES string. Still, something is missing. Wouldn't it be better if the application responded to individual keystrokes in the input field, rather than waiting for the user to hit the return key? In this tutorial, we'll see how to quickly accomplish this effect with a technology called "Ajax."

# Downloads and Prerequisites

For this tutorial, you'll need <a href="http://depth-first.com/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0">Ruby CDK</a> (RCDK). A recent article described the small amount of system configuration required for <a href="http://depth-first.com/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">RCDK on Linux</a>. Another article showed how to install <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">RCDK on Windows</a>.

In addition, you'll need to install <a href="http://www.rubyonrails.org/down">Ruby on Rails</a> - something that can be done through <a href="http://docs.rubygems.org/">RubyGems</a>.

The Rails application that this tutorial starts with can be downloaded from [this link](/images/posts/20061127/depict-20061127.tar.gz). If you'd rather start working directly with the version of Depict produced by applying the changes outlined in this tutorial, the full source code can be downloaded from [this link](/images/posts/20061204/depict-20061204.tar.gz).

If you'll be running Depict on an AMD64 Linux system, you'll need to prepend your invocation of `script/server` with `LD_PRELOAD`. For example, on my system running Sun's JVM, the full command looks like:

```bash
LD_PRELOAD=/usr/java/jdk1.5.0_09/jre/lib/amd64/libzip.so ruby script/server
```

# A Brief Introduction to Ajax

When stripped down to its essentials, <a href="http://ajaxian.com/">Ajax</a> is nothing more than an asynchronous communication channel between Web browsers and Web servers. In the pre-Ajax model of client-server Web interactions, a browser would make a request to a server and then wait until getting a server response, which would take the form of a complete Web page. In the Ajax model, a browser makes a request to a server, continuing to function while the server generates a response, which takes the form of a small section of the page that gets replaced. For this reason, Ajax-enabled Web sites are far more application-like than the document-centric sites that preceded them.

# Ajax Support in Rails

Ajax is implemented in JavaScript using the `HTMLHttpRequest` object, although working at this level can require a lot of code to do anything meaningful. Fortunately, Rails and other Web application frameworks provide high-level interfaces to Ajax. In Rails, Ajax support takes the form of a variety of helper methods, one of which we'll use in this tutorial: `observe_field`. This method, an instance of the <a href="http://en.wikipedia.org/wiki/Observer_pattern">Observer Pattern</a>, assigns an Observer to monitor input activity in a text field.

# The Problem at Hand

We'd like Depict to provide immediate feedback by rendering a SMILES string as it is keyed into the input field. If the partial SMILES string is valid, it will be rendered, otherwise, an error image will be rendered. At no point will the user need to press the return key to see an image of the SMILES string they are typing.

# Step 1: Ajaxify the View

Let's start by adding an observer to Depict's input field. These changes will occur to the SMILES View, contained in <strong>depict/app/views/smiles/depict.rhtml</strong>:

```html
<html>
  <head>
    <title>Depict</title>
    <%= stylesheet_link_tag "default", :media => "all" %>

    <!-- Nothing works without this line. -->
    <%= javascript_include_tag :defaults %>
  </head>
  <body>
    <h1>Depict a SMILES String</h1>

    <!-- New id attribute needed by Ajax -->
    <div class="image" id="results" >
      <img src="<%= image_for_smiles :smiles => @smiles %>"></img>
    </div>
    <br /><br />
      <div class="smiles">
      <%= form_tag :action=>'depict' %>
        <label>SMILES: </label>

        <!-- Ajaxified text field. -->
        <!-- We turn off autocomplete to simplfify the interface. -->
        <%= text_field_tag :smiles, @smiles, {:autocomplete => "off"} %>
        <%= observe_field( :smiles,
                           :frequency => 0.5,
                           :update    => :results,
                           :url       => { :action => :ajax_depict } ) %>
      <%= end_form_tag %>
      </div>
  </body>

  <div class="about">
    <!-- Update the URL to point to the new Depth-First article -->
    <a href="http://depth-first.com/articles/2006/12/04/anatomy-of-a-cheminformatics-web-application-ajaxifying-depict">About this Application</a>
  </div>
</html>
```

The above code introduces three key elements:

- The `javascript_include_tag` method is called, which is surprisingly easy to forget to do.
- The original `text_field` method call is replaced by `text_field_tag` to simplify coding. We disable browser-based autocompletion by setting the `autocomplete` attribute to `off`. This removes a feature unlikely to ever be used, and leads to a more streamlined interface.
- The `observe_field` method is called, linking activity in the text field to an Ajax action, `ajax_depict`, that will update the image area. To accomplish this, we assign the `div` containing our image the id "results."

Making these changes and refreshing the browser window gives a screen like the one below:

![Step 1.1](/images/posts/20061204/step_1_1.png "Step 1.1")

Although the client side of the Ajax communication channel is working, the server side is not. Let's fix that.

# Step 2: Ajaxify the Server

Depict needs an Action and View that will be invoked in response to keyboard events in the SMILES input box. To do this, first add a new `ajax_depict` method to `SmilesController`, the source for which is found in <strong>depict/app/controllers/smiles_controller.rb</strong>:

```ruby
class SmilesController < ApplicationController
  def depict
    if params[:smiles]
      @smiles = params[:smiles][:value]
    else
      @smiles = ''
    end
  end

  def image_for
    if flash[:bytes]
      send_data(flash[:bytes], :type => "image/png", :disposition => "inline", :filename => "#{flash[:smiles]}.png")
    end
  end

  # The new ajax_depict method.
  def ajax_depict
    @smiles=request.raw_post
  end
end
```

Making the above changes and refreshing your browser should give an error message:

![Step 2.1](/images/posts/20061204/step_2_1.png "Step 2.1")

The new `ajax_depict` method is being called, but no associated template exits. This template contains the HTML that will be inserted into the `div` with the `results` id attribute that we set up in Step 1. We can resolve the error we're getting by simply creating a new file (<strong>depict/app/views/smiles/ajax_depict.rhtml</strong>) containing the following partial template:

```html
<img src="<%= image_for_smiles :smiles => @smiles %&gt;"&gt;</img>
```

Now, refreshing your browser should produce a screen like that shown below. We have now Ajaxified Depict, but we're not quite done yet.

![Step 2.2](/images/posts/20061204/step_2_2.png "Step 2.2")

# Step 3: Update the Cascading Style Sheet

As you type a SMILES string into the input window, you may have noticed the input box being repositioned toward the top of the application window just prior to the display of a new image. This is due to the image area being resized to zero height as the new image is generated.

Fortunately, the fix is simple; we'll just specify that the image area must be 400 pixels high, whether an image is being displayed or not. This is done by editing the `image` selector in the CSS file at <strong>depict/public/stylesheets/default.css</strong>:

```css
.image {
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    /* Keeps the input box from moving during image refresh.*/
    height: 400px;
}
```

Refreshing the Depict window should now give a statically-positioned SMILES input field.

# Step 4: Backward Compatibility

As it stands, if the user presses the return key, they will see the "Enter SMILES Below" message. This is due to the change in the way SMILES strings are transmitted into the application. To fix this problem, we simply change the way that `SmilesController` assigns the `smiles` instance variable (<strong>depict/app/controllers/smiles_controller.rb</strong>):

```ruby
def depict
  # Uses new input method.
  if params[:smiles]
    @smiles = params[:smiles]
  else
    @smiles = ''
  end
end
```

Making this change produces an interface that will render the correct image whether the return key is typed or not. If JavaScript is disabled, Depict will work exactly the same way as it did in the non-Ajax version.

# Conclusions

Ajax makes the Web more attractive than ever as an application development platform. In this tutorial, we've seen how using Rails made it very easy to give Depict the feel of an interactive SMILES depiction tool using Ajax. But a few details remain before we're ready to deploy this application on a Web server for the public to use. For example, we need to take server load and network latency into account, and we need to make sure Depict works well on all major browsers. The next articles in this series will address these issues.