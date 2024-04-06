---
title: "Generating and Serving 2-D Molecular SVGs"
published: "2006-09-09T00:00:00.000Z"
---

A <a href="/articles/2006/09/07/rendering-molecules-with-svg-on-the-web">previous article</a> showed some examples of 2-D molecular rendering using Scalable Vector Graphics (SVG) embedded in a web page. This article will outline some simple steps for generating these images and publishing them on the Web.

# Prerequisites

This tutorial uses <a href="/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk">Structure-CDK</a>, a <a href="http://cdk.sf.net">CDK</a> add-on library written in Java. You'll need to install Sun's JDK 1.4.2 or later (or an open source alternative). Although not required, <a href="http://ant.apache.org/">Ant</a> makes it easy to use Structure-CDK. You'll want to make sure that your browser is <a href="/articles/2006/09/07/rendering-molecules-with-svg-on-the-web">SVG-enabled</a>.

# Creating a 2-D Molecular SVG File

![MDMA](/images/posts/20060909/mdma.svg)

An SVG image like the one shown above can be created with this sequence of steps:

<ol>
  <li>Download and unzip the <a href="http://prdownloads.sourceforge.net/structure/structure-cdk-0.1.2.zip?download">current release</a> of Structure-CDK.</li>
  <li>Move into the unzipped Structure-CDK directory and run the Structure Visual Testing Framework:

  ```bash
  cd structure-cdk-0.1.2
  ant vis
  ```
  </li>
  <li>From the <strong>File</strong> menu, choose <strong>Open...</strong> and use the file dialog to open a molfile. The <strong>molfiles</strong> directory contains some samples.</li>
  <li>Resize the image to taste and choose <strong>Save as SVG...</strong> from the <strong>File</strong> menu. This writes the SVG image to a directory and filename of your choice.</li>
</ol>

# Viewing the SVG File

You now have several options for viewing the SVG file. One of the simplest is to open it with the <a href="http://www.mozilla.com/firefox/">Firefox browser</a>. Another option is to open it with the excellent, free SVG editor <a href="http://www.inkscape.org/">Inkscape</a>. From Inkscape, you can edit your image, apply any number of special effects from the mundane to the remarkable, and save the result to disk.

# Deploying the SVG File on the Web

After uploading your SVG file to a blog or other site, you may have some additional configuration to do. Because the SVG MIME type is not configured by default on all servers, you may need to do so yourself.

After uploading my first set of SVG files to my server, I tried to view them in Firefox. Instead of seeing the expected image in the browser window, I got a dialog asking if I wanted to open it with Inkscape or save it to disk.

With the help of <a href="http://www.mozilla.org/projects/svg/faq.html#choose-a-program">some documentation</a>, I was able to track the problem down to my server, which was using the MIME type "image/svg-xml" instead of "image/svg+xml". The former is the obsolete SVG MIME type, which Firefox rejects. Internet Explorer equipped with Adobe's SVG plugin, on the other hand, accepts the obsolete MIME type, rendering SVG without presenting a dialog. <a href="http://web-sniffer.net/">Web-Sniffer</a>, which decodes header information from HTTP responses, may be useful for debugging your server's MIME type configuration.

Having configured your server's SVG MIME type as "image/svg+xml", pointing your browser to your SVG file's URL will let you view it in its full, W3C-compliant glory.

# Embedding the SVG File in HTML

There are a few options for embedding an SVG image in HTML. The most universally-applicable mechanism is the <code>&lt;embed&gt;</code> tag:

```html
<html>
  <head></head>
  <body>

  <!-- document body -->

  <embed src="url-to-svg-file.svg" TYPE="image/svg+xml" width="400" height="400" />

  </body>
</head>
```

Embedding SVG into HTML carries some limitations. For example, you can't interact with the SVG DOM the way you can if the SVG is inlined, or placed directly into the HTML document itself. But that's a subject for another time.

Creating and deploying 2-D molecular images as SVG documents is a straightforward process, provided that some details are taken care of. Future articles in this series will show how SVG's advanced features make it a compelling choice as a chemical informatics rendering platform.

*Note: if your're viewing this article in a feed aggregator, the SVG images may have been stripped out. If so, please see the <a href="/articles/2006/09/09/generating-and-serving-2-d-molecular-svgs">original article</a>.*