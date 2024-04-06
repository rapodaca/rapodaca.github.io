---
title: "REST Tip: Use JSONView for In-Browser JSON Syntax Highlighting"
published: "2009-10-01T00:00:00.000Z"
---

One of the problems with working with JSON is getting a nice browser view with syntax highlighting and collapsible elements, as is possible with XML.

Over at the [Metamolecular Products Blog](http://products.metamolecular.com) is an example of how [Chemcaster](http://chemcaster.com) enables you to [directly view JSON representations of resources in your browser with syntax highlighting](http://products.metamolecular.com/2009/10/01/chemcaster-tips-view-json-from-your-browser-with-syntax-highlighting).

For example, here's a representation of one of my [Registries](http://chemcaster.com/rest/registry-resource) in bare JSON:

![ChemCaster](/images/posts/20091001/chemcaster.png "ChemCaster")

The trick: install the excellent Firefox plugin [JSONView](http://brh.numbera.com/software/jsonview/) and you'll have syntax highlighting, indentation, and collapsible tree representations. It's very useful for working with REST APIs that expose raw JSON.