---
title: "CampDepict: Building a Simple SMILES Depict Web Application With JRuby, Structure CDK, and Camping"
published: "2008-04-23T00:00:00.000Z"
---

Today's tribute to the power of simplicity comes by way of [John Jaeger](http://goeslightly.blogspot.com/), who has built one of the simplest cheminformatics Web applications ever written. His creation, [CampDepict](http://goeslightly.blogspot.com/2008/04/campdepict-jruby-cdk-and-camping.html), interactively produces a raster image of a 2D chemical structure given a SMILES string, not unlike [Daylight's Depict application](http://www.daylight.com/daycgi/depict).

CampDepict uses the Ruby Web microframework [Camping](http://redhanded.hobix.com/bits/campingAMicroframework.html). From the [README](http://camping.rubyforge.org/files/README.html):

> Camping is a web framework which consistently stays at less than 4kb of code. You can probably view the complete source code on a single page. But, you know, it‘s so small that, if you think about it, what can it really do?
>
> The idea here is to store a complete fledgling web application in a single file like many small CGIs. But to organize it as a Model-View-Controller application like Rails does. You can then easily move it to Rails once you‘ve got it going.

John's application is loosely-based on the [Rails Depict](http://depth-first.com/articles/2006/12/04/anatomy-of-a-cheminformatics-web-application-ajaxifying-depict) application first described in 2006 here on Depth-First. His code makes use of [CDK](http://cdk.sf.net) and [Structure CDK](http://sf.net/projects/structure), and it runs on [JRuby](http://jruby.codehaus.org/).

If you've ever been curious about what Ruby has to offer cheminformatics, CampDepict could be just the application to get your feet wet.