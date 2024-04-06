---
title: Building Chempedia - Start Simple, Then Iterate
published: "2008-05-13T00:00:00.000Z"
---

As a medium for building software, the Web offers unparalleled adaptability. With nothing to download or install, users of Web applications automatically see the newest version - always. This may sound like a small thing, and technically it is. But it dramatically increases the effectiveness with which software can be created. [The previous article in this series](/articles/2008/04/28/building-chempedia-indexing-wikipedias-6-411-compound-monographs) introduced [Chempedia](http://chempedia.com), the free Chemical encyclopedia and cheminformatics Web application. This article will discuss the process by which Chempedia will become a better service over time.

# Iterative Web Application Development

Chempedia, like all actively-developed software, is a work in progress. It will be built in stages starting with the addition of new features, followed by a round of user feedback, bug fixing, and stabilization. This will then be followed by the next major iteration, and so on.

This iterative design style is ideally suited for Web applications. Because the barrier to pushing out new versions is essentially non-existent, a Web application can evolve at a much more rapid rate than other kinds of software. Indeed, the first version of a Web application need only work well enough to prove a point.

One of the keys to iterative Web development is a technology framework designed to facilitate it. Chempedia is being developed with [Ruby on Rails](http://rubyonrails.com/), a tool that enables Web developers to take full advantage of the iterative development style the Web makes possible.

Another key element of iterative Web development is users willing to explore the system and offer criticism. Evolution succeeds only when the environment stresses an ecosystem; the same is true in Web application development.

Chempedia will take full advantage of the evolutionary nature of Web application development. As features are added and (hopefully) use of the service grows, Chempedia will evolve in ways that are impossible to predict today.

# What's Wrong With Chempedia?

If you happened to take a look at Chempedia last week (that version is now no longer visible), you probably noticed many, many things that needed improvement. Some concerns were in the areas of:

-  Navigation. Navigation works best when the right granularity of options is achieved. Chempedia's navigation system grouped both closely-related and dissimilar actions at the same level.
-  Metaphor. The initial idea behind Chempedia was to see what happened when PubChem's chemical structures were mashed up with Wikiepia articles, using [CAS numbers](/articles/2007/05/21/simple-cas-number-lookup-with-pubchem) as the common link. The site design reflected this, with no clear organizing principle other than mashup. However, after the initial demonstration of the success of this approach, it became clear that Chempedia was strikingly similar in both form and function to the [Merck Index](/articles/2008/04/28/building-chempedia-indexing-wikipedias-6-411-compound-monographs). Perhaps this should be used as a clue in deriving a better organizing principle.
-  Wikipedia integration. The old Chempedia site didn't make it nearly as convenient as is should be to create or edit compound monographs. Because Chempedia serves as a chemically-aware front-end for Wikipedia, the easier it is to get to Wikipedia from Chempedia, the better.

# What Changed?

During the process of trying to fix Chempedia's problems, it became clear that a major redesign was in order. This consisted of:

-  **Creating a landing page oriented toward search.** Using the Merck Index as a metaphor suggested that [Chempedia's landing page](http://chempedia.com) should be designed around search, not browsing - as it was originally designed.
-  **Emphasizing compound monographs, not compounds.** Chempedia's central organizing principle is now the Compound Monograph. One way this is seen is in the new URL structure, which makes it very easy to see where a Chempedia link is about to take you. For example, consider the URL for [benzene](http://chempedia.com/monographs/benzene). Another way this can be seen is in the inclusion of [Compound Monographs lacking a chemical structure](http://chempedia.com/monographs/virginiamycin).
-  **Designing a streamlined menu system.** The main menu system has been broken down into just three main categories: [Search](http://chempedia.com/); [Browse](http://chempedia.com/monographs); and [Create](http://chempedia.com/monographs/new). These headings refer to actions on Compound Monographs, again in line with their importance as an organizing principle.
-  **Promoting better integration with Wikipedia.** After experimenting with a few implementation possibilities, it is now possible to edit Wikipedia articles directly from the Chempedia site, thanks to the use of [inline frame](http://en.wikipedia.org/wiki/IFrame). Once again, this capability is tied to the Compound Monograph, from which editing and updating links are accessible.
-  **Striving for comprehensive Wikipedia coverage.** Wikipedia had far more compound monographs than could be found on Chempedia, [6,411 of them](/articles/2008/04/28/building-chempedia-indexing-wikipedias-6-411-compound-monographs), to be precise. Chempedia now contains all of them, regardless of whether a chemical structure can be found based on a CAS number in PubChem. This includes inorganics, organometallics, polymers, mixtures, and polypeptides.

# Miles to Go Yet

Chempedia is far from being finished. For example, you'll notice many instances in which a Compound Monograph is [truncated](http://chempedia.com/monographs/parthenolide). This arises from difficulties in parsing Wikipedia's [Wikitext](http://en.wikipedia.org/wiki/Wikilink) format (more on this later).

Ultimately, the full text of each Wikipedia article will be present on Chempedia rather than just the first introductory paragraph. But it will take a significant amount of work to ensure that each article's Wikitext entry can be parsed faithfully.

Chempedia allows search by CAS number, PubChem CID and exact title. Full-text searching is not yet implemented, nor is autocomplete search, both of which would greatly enhance the usability of the service.

Exact structure searching is made possible by the [ChemWriter](http://metamolecular.com/chemwriter) editor in combination with [SHA-1](http://en.wikipedia.org/wiki/SHA-1) hashed [InChIs](/articles/2007/09/27/inchi-for-newbies). Substructure search and query atom search will ultimately be added, but for an encyclopedia containing relatively few molecules, most of which having trivial names, this isn't yet seen as being critical.

You'll notice many Monographs on Chempedia that have no structure information. Behind the scenes, Chempedia uses the 350,000+ CAS numbers now contained in the [PubChem](http://pubchem.ncbi.nlm.nih.gov/) database to associate a chemical structure with a Wikipedia article. In the future, these associations will be made by Chempedia and Wikipedia users, which will allow every Chempedia small-molecule Monograph to have a structure associated with it. (It will also create a rather large, publicly-curated, open database of CAS numbers linked to chemical structures, but that's a story for another time).

# Your Feedback is Essential

Finally, many of the changes made in this iteration were the result of conversions with chemists and developers. If you see something on Chempedia that just doesn't work for you, please don't be shy about [saying so](http://chempedia.com/messages/new). Feedback is an essential ingredient in making Chempedia the best service it can be.