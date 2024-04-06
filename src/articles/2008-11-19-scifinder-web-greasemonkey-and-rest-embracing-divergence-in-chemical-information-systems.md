---
title: SciFinder Web, Greasemonkey, and REST - Embracing Divergence in Chemical Information Systems
published: "2008-11-19T00:00:00.000Z"
---

Recently, [Alain Borel](http://personnes.epfl.ch/alain.borel) posted a message to the [CHMINF-L list](https://listserv.indiana.edu/cgi-bin/wa-iub.exe?A0=CHMINF-L) describing his successful attempt to get links to external datasources to show up in SciFinder Web:

>I'm dreaming of a world where chemical data is hyperlinked as thoroughly
as text data is today (or even more)... here's my small contribution to
this goal.
>...
>Basically, Greasemonkey allows you to rewrite the HTML content of a web
page before it is rendered in the browser window. Thanks to this, I've
been able to write a script that adds links to external databases
through registry numbers. Currently, [ChemSpider](http://chemspider.com), [Chempedia](http://chempedia.com) and [Chemexper](http://chemexper.com) \[links added\]
are supported - I also have a private version that links to our Intranet
chemical stocks application. The pleasant side for those who worry about
intellectual property is that neither side of the link needs to know
what's on the other side, and even the plugin doesn't know what's inside
the database records.

[Greasemonkey](http://personnes.epfl.ch/alain.borel) is the client-side script plugin engine that enables users to change the appearance and content of any site. Although originally designed as a Firefox extension, as least some Greasemonkey scripts can be run in [Safari](http://www.simplehelp.net/2007/11/14/how-to-run-greasemonkey-scripts-in-safari/) and [Chrome](http://www.ghacks.net/2008/10/18/google-chrome-adds-greasemonkey-support/). A [recent paper](http://dx.doi.org/10.1186/1471-2105-8-487) describes some of the potential for this form of scripting in the life sciences.

Alain's script, which can be [freely downloaded](http://biscom.epfl.ch/scifinder_links.user.js), uses [CAS numbers](/articles/2008/05/26/simple-cas-number-lookup-and-more-with-chempedia) to link SciFinder records to the external databases. Although I don't have access to SciFinder Web, Alain's description makes it sound like each entry for a specific substance in SciFinder Web is given an additional set of links out to external datasources.

# What's REST Got To Do With It?

One of Alain's external datasources is [Chempedia](http://chempedia.com). A unique feature of Chempedia is the way it exposes a [an electronic paper trail for CAS numbers](/articles/2008/05/26/simple-cas-number-lookup-and-more-with-chempedia). Rather than just reporting a CAS registry number, it fully discloses which organization is asserting that a particular CAS number belongs with a structure.

For example, see [this entry on \[525-66-6\]](http://chempedia.com/registry_numbers/525-66-6).

Chempedia was designed from the start to apply the principles of [REST](/articles/2007/05/30/restful-cheminformatics). The big idea behind REST is that every resource on the Web, such as a CAS number, can be manipulated by exactly four methods: GET; PUT; POST; and DELETE.

The highly-desirable side-effect of designing Web sites around the concept of resources being acted on by exactly four methods is that sites applying this philosophy become orders of magnitude easier to [mash up](/articles/2006/09/23/mashups-for-fun-and-profit).

Alain's Greasemonkey script is an example of a client-side mashup. But how did he do it?

# CAS Numbers are First-Class Citizens

Each CAS number on Chempedia is a resource that can be accessed by a URL taking the form:

`http://chempedia.com/registry_numbers/REGISTRY\_NUMBER`

where `REGISTRY_NUMBER` is the CAS number of interest. For example, acetaminophen has the registry number \[103-90-2\] and it can be accessed with this URL:

[http://chempedia.com/registry_numbers/103-90-2](http://chempedia.com/registry_numbers/103-90-2)

If you request a CAS number that doesn't exist, you should receive a 404 error, although a bug in Chempedia is currently preventing that from happening.

To link SciFinder Web to Chempedia, Alain's user script simply looks for which CAS number the SciFinder page is talking about and constructs the RESTful URL. It doesn't get much simpler than that.

# Conclusions

Chemistry is a large, established field. Not surprisingly, [specialization is an essential part of being a chemist](/articles/2008/05/07/1908-and-all-that-the-long-tail-and-chemistry). It's therefore to be expected that chemical databases will diverge into a variety of specialized forms. One size will almost certainly not fit all.

We can deny this simple fact and build ever more complex and unusable chemical information systems. Or we can accept it and custom-build our services for the job at hand.

RESTful server architectures and mashups offer a powerful way to accomplish this goal.
