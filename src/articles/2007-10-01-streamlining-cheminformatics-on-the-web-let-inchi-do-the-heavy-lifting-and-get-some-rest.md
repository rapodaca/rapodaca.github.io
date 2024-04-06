---
title: Streamlining Cheminformatics on the Web - Let InChI Do the Heavy Lifting and Get Some REST
published: "2007-10-01T00:00:00.000Z"
---

A recent Depth-First article discussed the advantages of [minimal Web APIs in Cheminformatics](/articles/2007/08/13/the-best-api-may-be-no-api-at-all-pubchem-and-pdb). Recently, Antony Williams unveiled some [simplified ChemSpider URL schemes](http://www.chemspider.com/blog/?p=179), mainly from the perspective of enabling Google indexing. However, it's possible to take this scheme much, much further. Here I present a proposal for radically simplifying (and unifying) the development of cheminformatics Web APIs and the software that interacts with them.

# The New ChemSpider URLs

ChemSpider now has several new kinds of URLs. For the purposes of this article, the most interesting of these are of the format:

-  [http://www.chemspider.com/InChIKey=DEIYFTQMQPDXOT-RERXVCSDCZ ](http://www.chemspider.com/InChIKey=DEIYFTQMQPDXOT-RERXVCSDCZ)
-  [http://www.chemspider.com/InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H](http://www.chemspider.com/InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H)

These URLs may seem unremarkable, but there's much more than meets the eye. They let anonymous developers query ChemSpider about specific substances - without needing to know much at all about how ChemSpider itself works. Goodbye API. Goodbye API support. Goodbye API documentation. Goodbye angle brackets. Hello to getting stuff done. It's all very [RESTful](/articles/2007/05/30/restful-cheminformatics). Well, at least it could be that way with some minor modification.

# Some Recommendations

ChemSpider hasn't quite reached that place where the API [just disappears](http://wwmm.ch.cam.ac.uk/blogs/downing/?p=128). The problem is that the ChemSpider URLs listed above point to query results pages, not compound summary pages. Were these URLs to redirect to a summary page, we could construct the following URLs to extract ChemSpider resources (I've replaced the '=' sign with a '/' for simplicity):

-  **.../InChIKey/DEIYFTQMQPDXOT-RERXVCSDCZ** Get all resources for the molecule identified by the given InChIKey - i.e., "Compound summary page"
-  **.../InChIKey/DEIYFTQMQPDXOT-RERXVCSDCZ/molfile.mol** Get the molfile for the molecule identified by the given InChIKey
-  **.../InChIKey/DEIYFTQMQPDXOT-RERXVCSDCZ/large_image.png** Get the large image for the molecule identified by the given InChIKey.
-  **.../InChIKey/DEIYFTQMQPDXOT-RERXVCSDCZ/citations.xml** Get the list of citations for the molecule identified by the given InchIKey, in XML format.

Jane, a developer building Web applications on top of this new ChemSpider API, would immediately notice that things just work. Let's say her online database stores IC<sub>50</sub>s at the dopamine D<sub>2</sub> receptor. On the summary page for each molecule, she wants to link out to the ChemSpider compound summary page, if available. She would simply construct the InChIKey on her server, build the needed ChemSpider URL and GET it. An HTTP 404 would indicate no molecule with that Key exists on ChemSpider and so no link would be shown. An HTTP 200 would indicate ChemSpider has the molecule, and so the link would appear.

# Conclusions

It would be interesting enough if ChemSpider adopted a system like that described here. But the real power of this approach would emerge if multiple Web services were to adopt it. By following a simple set of conventions, these services would enable third party developers to elegantly [mashup](/articles/2006/09/23/mashups-for-fun-and-profit) all manner of cheminformatics resources into applications unimaginable today.

Technically, there's nothing that prevents this system from being implemented on every [free chemistry database](/articles/2007/01/24/thirty-two-free-chemistry-databases) in existence today. However, doing so would transfer a significant degree of control from service operators to third-party developers. Not all providers will be comfortable with that idea.

Cheminformatics Web service providers need to carefully consider whether they're trying to develop a [platform or an integrated service](/articles/2007/07/04/pubchem-is-a-platform). As history has shown, the strategies, and upside potential, for each approach can differ dramatically.