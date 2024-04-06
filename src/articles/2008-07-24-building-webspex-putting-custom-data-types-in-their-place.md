---
title: Building WebSpex - Putting Custom Data Types In Their Place
published: "2008-07-24T00:00:00.000Z"
---

The previous article in this series introduced [WebSpex](/articles/2008/07/17/javascript-for-cheminformatics-an-introduction-to-webspex-a-spectroscopy-tool-for-the-internet), a spectroscopic data visualization tool being designed especially for use in a Web browser. Previously, the platform on which the user interface would be built was discussed. This article will discuss the question of where to put the spectroscopy data that WebSpex will display.

# Tag Soup

We've decided to target WebSpex for use on the Web, which means that spectroscopy data would need to be referenced or embedded in a Web page. How should we do this? The answer, it turns out, is far from obvious.

If we knew that WebSpex were going to be created as a Java or Flash applet, which is not the current plan, we might be tempted to pass a reference to the data (or the data itself) as a parameter in the [<code>&lt;object&gt;</code> tag](/articles/2008/03/12/demystifying-java-applets-part-3-failing-gracefully-when-your-users-dont-have-java). For an applet, this might look something like:

```xml
<object type="application/x-java-applet;version=1.4.2" width="520" height="350">
  <param name="code" value="com/metamolecular/webspex/applet/FullApplet.class">
  <param name="archive" value="http://metamolecular.com/applets/webspex.jar">
  <param name="jcamp" value="http://base-url/spectrum.jdx">
</object>
```

In the example above, the parameter <code>jcamp</code> would encode the path to a JCAMP-DX file for WebSpex to load.

Alternatively, if we were going to develop WebSpex as a Flash applet, we might use an object tag like this:

```xml
<object type="application/x-shockwave-flash" width="520" height="350">
  <param name="movie" value="webspex.swf">
  <param name="FlashVars" value="filename=http://spectrum.jdx">
</object> 
```

In this example, we associate the parameter <code>filename</code> with the value "spectrum.dx" using [FlashVars](http://www.permadi.com/tutorial/flashVars/index.html).

This works well enough, but what if we need to load a custom data type in a Web page without a plugin?

# Some Options

There are a few options for including custom data in an HTML document:

-  **Invent our Own Tag** Browsers are designed to ignore content they don't understand. We could just hack our own tag, let's call it <code>&lt;spectrum&gt;</code>. But for a variety of reasons, this is a bad idea. Most importantly, we'd be breaking with conventions used worldwide, which is never a good idea without a very good reason. For another, any developer tools we'd use would probably complain about a mis-formed HTML document. Still another reason might be that browsers could parse our invented tag in unpredictable ways. We may also run into problems with search engines not indexing our content properly.
-  **Use XHML** We could try inventing a tag the right way: with [XHTML](http://en.wikipedia.org/wiki/XHTML). This might be a worthwhile option if our data type ([JCAMP-DX](http://dx.doi.org/10.1351/pac199163121781)) were XML-based, but it's not. At best we'd expend a lot of effort learning about namespaces, schema, and HTTP response headers only to end up with an amorphous flat <code>&lt;spectrum&gt;</code> tag containing freeform text.
-  **Use JSON** We could encode our JCAMP-DX files as [JSON](http://www.json.org/js.html). JSON is a markup language like XML, but with the difference that it can be <code>eval</code>ed directly by the JavaScript interpreter. This has the advantage that either a filename, or the actual data could be encoded. We could, in fact, create the entire object model for our spectrum, ready to be displayed, if we had software that could make the conversion from JCAMP-DX to JSON. This approach has the disadvantage that it could require significant amounts JavaScript code to be mixed in with our HTML, [a less than ideal solution](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript).
-  **Use the Object Tag** Given that none of the three options above are especially appealing, we might ask ourselves whether we've really tried everything possible to use plain old HTML to encode our data. More specifically, what if we were to use the object tag itself, without actually having a plugin?

# Encoding Custom Data Types With The Object Tag

The [HTML 4 specification](http://www.w3.org/TR/REC-html40/struct/objects.html#h-13.3) has this to say about the object tag:

>Most user agents have built-in mechanisms for rendering common data types such as text, GIF images, colors, fonts, and a handful of graphic elements. To render data types they don't support natively, user agents generally run external applications. The OBJECT element allows authors to control whether data should be rendered externally or by some program, specified by the author, that renders the data within the user agent.
>
>In the most general case, an author may need to specify three types of information:
>
>-  The implementation of the included object. For instance, if the included object is a clock applet, the author must indicate the location of the applet's executable code.
>-  The data to be rendered. For instance, if the included object is a program that renders font data, the author must indicate the location of that data.
>-  Additional values required by the object at run-time. For example, some applets may require initial values for parameters.
>
>The OBJECT element allows authors to specify all three types of data, but authors may not have to specify all three at once. For example, some objects may not require data (e.g., a self-contained applet that performs a small animation). Others may not require run-time initialization. Still others may not require additional implementation information, i.e., the user agent itself may already know how to render that type of data (e.g., GIF images).

In other words, we could place a reference to a spectrum object in an HTML page with code like this:

```xml
<object width="520" height="350">
  <param name="data" value="http://base-url/spectrum.jdx">
</object>
```

After loading the document, we could have WebSpex walk the DOM looking for object tags that could be replaced with an instance of WebSpex. That instance could actually be placed inside the original object tag like this:

```xml
<object width="520" height="350">
  <param name="data" value="http://base-url/spectrum.jdx">
  <div class="webspex">
    <!-- WebSpex visual presentation -->
  </div>
</object>
```

The HTML 4 documentation states that any content contained within object tags not recognized by the user agent will be rendered (fallback content). So dynamically inserting the div into the object tag as shown above would have the effect of giving the browser something to display in place of the object tag.

# Advantages of Using This Approach

This approach has several advantages worth mentioning:

-  It's fully compliant with the HTML 4 specification.
-  It provides a natural anchor point to attach both the custom data and the visual presentation of that data.
-  It's pure HTML, requiring minimal mixing in of JavaScript content.
-  Web spiders can be taught a single method to associate a spectrum with a URL, regardless of how the viewer is implemented.
-  It's technology-agnostic. This approach lets us implement WebSpex as a Java or Flash applet (or some other plugin technology) just as easily as a pure JavaScript UI. To change our viewer implementation, we just change a JavaScript file.
-  It allows spectra to be inlined, or place directly into the HTML. Using a [Data URI](http://en.wikipedia.org/wiki/Data:_URI_scheme), we could replace "http://base-url/spectrum.jdx" with something like "data:chemical/x-jcamp-dx;base64,iVBORw0KGgoAA...". This would be important in those situations in which a public URL to a JCAMP file was not feasible and/or desirable. It could also accelerate the rendering of multiple spectra in the same page by eliminating the need to create a separate HTTP request for each file.

The method carries an imporant limitation: if a user has disabled JavaScript, they may see nothing to indicate a problem. We could address this issue by always placing fallback content in the object tag that would then be overwritten by the JavaScript code.

# Implementation Detail

This approach relies on [Onobtrusive JavaScript](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript) techniques to keep JavaScript as separate from HTML as possible. One way to implement such a scheme would be to include a single reference to the relevant JavaScript somewhere in the document, probably withing the &lt;head&gt; tag or right after the opening &lt;body&gt; tag:

```html
<script type="text/javascript" src="webspex.js"></script>
```

The file webspex.js would then execute code to place a function into the document's <code>onLoad</code> queue that would scan for object tags containing JCAMP-DX content and insert the needed viewer.

# Previous Uses

I'm unaware of any previous applications of this technique, although is seems like something that may have been used before.

# Conclusions

Encoding and displaying custom data types in HTML is possible by using the HTML 4 object tag coupled with client-side JavaScript to rewrite the DOM. It offers the potential to create HTML documents that are both human- and machine-readable. Although the approach described here was developed for the special case of spectroscopy data, it could in principle be used for any data type requiring a visual presentation.

