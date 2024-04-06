---
title: How to Enable Exact Structure Search and Substructure Search for Your Chemical Database
disqus: true
published: "2010-10-20T00:00:00.000Z"
---

It's a simple and increasingly common question: how can I enable users to search my website by chemical structure? Text search can be done relatively easily, but chemical exact structure and substructure search are considerably more complex. This article offers a high-level overview for non-experts of what's needed to create a structure-searchable chemical database.

# The Components

1.  **Web Application Framework.** This is the high-level software on which your current site is built or will be built. Popular packages include: [PHP](http://www.php.net/); [Ruby on Rails](http://rubyonrails.org/); [ASP .NET](http://www.asp.net/); and [Django](http://www.djangoproject.com/).
2.  **A Database.** There are many varieties to choose from. SQL flavors include [MySQL](http://mysql.com/) and [PostgreSQL](http://www.postgresql.org/). NoSQL flavors include [CouchDB](/articles/2009/04/22/couchdb-for-chemistry/).
3.  **Machine-Readable Structure Representations.** A number of formats have been developed over the years. Due to its nearly universal support by software packages, one of the most widely-used is [molfile](/articles/2010/06/28/latest-ctfile-formats-specification-available-now-from-symyx/).
4.  **Structure Canonicalizer.**  This software is used for fast exact structure search. A canonicalizer converts a chemical structure into a unique string of text that can be stored and searched using standard database technologies. [InChI](http://en.wikipedia.org/wiki/International_Chemical_Identifier) should be the default choice.
5.  **Fingerprint Generator.** Converting chemical structures into fixed-length binary fingerprints, this software is used to pre-screen structures during substructure search. The reason is simple: substructure search is computationally expensive and good fingerprints can eliminate many unnecessary substructure searches. A number of open source packages are suitable, including: [MX](http://metamolecular.com/mx); [CDK](http://sourceforge.net/apps/mediawiki/cdk/index.php?title=Main_Page); [OpenBabel](http://openbabel.org/wiki/Main_Page); [RDKit](http://rdkit.org/) and a few closed-source offerings.
6.  **Substructure Matcher.** Performs substructure matching through atom-by-atom search (ABAS). This software is used after an initial fingerprint screen. Although fingerprints never generate a false negative, they can and do generate false positives. A substructure matcher ensures no false positives get presented to your users. Packages that can generate fingerprints can usually perform substructure matches as well.
7.  **Chemical Structure Editor.** Allows chemists to draw structures to be searched. A few [free structure editors](/articles/2006/08/21/four-free-2-d-structure-editors-for-web-applications/) are available. One ergonomic and fast-loading commercial product is [ChemWriter](http://chemwriter.com), which is sold by [my company](http://metamolecular.com).

# Workflow

Felix, a user of your site, wants to search for indole substructures. Browsing to the "search" page, he draws indole using a structure editor and clicks the "Substructure Search" button. A JavaScript handler extracts the structure Felix drew into a hidden text field, then the form gets POSTED to your server. For details, see [Posting a Molfile in a Form](http://chemwriter.com/articles/posting-a-molfile-in-a-form).

Your server receives the POST request and extracts the "molfile" field contained in the form data. This is a substructure search, so the first thing your server will do is generate a fingerprint of the query structure. Then, your application will perform a [binary match of the query fingerprint to the fingerprints stored in your database](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases/).

A list of all candidate structures will be generated based on fingerprint matching. The members of this list will then be retained only if they pass the [atom-by-atom search test performed by your Substructure Matcher](/articles/2008/11/17/substructure-search-from-scratch-in-java-part-1-the-atom-mapping-problem/).

After all structures have been tested with the Substructure Matcher, you'll now have a list of hits. Using your Web Application Framework, the server will prepare a view of the results and render it for Felix.

Now let's say Felix wants to search for Donepezil. Browsing to the "search" page, he draws Donepezil using the structure editor and clicks the "Exact Structure Search" button. Like the substructure search example, a JavaScript handler copies the structure into a hidden text field and the form gets POSTed to your server.

Your server receives a POST request and extracts the "molfile" field from the form data. Using the Structure Canonicalizer, a unique string is generated for Donepezil. Your application searches the database for one exact match to the string. Your Web Application framework then prepares a view and renders it for Felix.

# Conclusions

Enabling exact structure search and substructure search takes a number of components working together. Although not extremely complicated, assembling the right software packages and integrating them is no trivial task.
