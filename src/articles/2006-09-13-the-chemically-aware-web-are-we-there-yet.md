---
title: "The Chemically-Aware Web: Are We There Yet?"
published: "2006-09-13T00:00:00.000Z"
---

Recently, I wrote a tutorial on <a href="http://depth-first.com/articles/2006/09/07/rendering-molecules-with-svg-on-the-web">embedding 2-D molecular renderings</a> into webpages as Scalable Vector Graphics (SVG). This tutorial also contained a small experiment on the current chemical informatics capabilities of the Web.

Here is a scenario from the near future: Joe is writing a review on Cephalosporin C that he wants to publish the modern way - directly to the Web. An entirely new concept in scientific publishing has started to take hold. Rather than submitting scientific articles to publishers, who then <a href="http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=28">make hamburger</a> out of them and strip authors of their rights to reproduce their own work, a new system in which journals simply aggregate <a href="http://depth-first.com/articles/2006/09/08/chemical-reviews-on-wikipedia">content already on the Web</a> is gaining momentum. Some journals specialize in only including the very best scientific Web content available, and so enjoy a prestige factor. It's still a peer review system, but with inversion of control. The trick for scientists is getting their work indexed, and so noticed, in the first place.

Joe just downloaded a new 2-D structure editor, FooChemPaint, that he heard can make the structure drawings in his review structure-searchable. Every chemist he knows is talking about a new free search engine called Haystac (<u>Hayst</u>ac <u>A</u>in't <u>C</u>hmoogle) that lets them substructure-search the web. For some reason, you need to create your structures using FooChemPaint if you want your own documents to be included in the search results.

After Joe finishes drawing Cephalosporin C with FooChemPaint, he chooses the File->Save As... menu item. Instead of saving as a JPG or PNG like he's done with other software, he saves the image as SVG. He then embeds the SVG into his review using a procedure similar to the <a href="http://depth-first.com/articles/2006/09/07/rendering-molecules-with-svg-on-the-web">one I outlined previously</a>.

From Joe's perspective, he hasn't done anything very new. But unknown to Joe, FooChemPaint has automatically inserted the <a href="http://www.iupac.org/inchi/">InChI identifier</a> of Cephalosporin C as metadata into his SVG document. This enables <a href="http://depth-first.com/articles/2006/09/02/humanizing-line-notations">ordinary search engines</a> such as <a href="http://google.com">Google</a> to associate the InChI with his SVG. The best part is that the entire process is essentially <a href="http://depth-first.com/articles/2006/09/05/the-automatic-encoding-of-chemical-structures">invisible</a> to Joe.

Haystac is a web application that presents users with an <a href="http://depth-first.com/articles/2006/08/21/four-free-2-d-structure-editors-for-web-applications">online structure editor</a> for preparing molecular queries. When a structure query is submitted, Haystac searches its molecular database for matches. This database, in turn, was built by a web spider specifically designed to look for InChI identifiers, maybe with the <a href="http://www.google.com/apis/">help of Google's Web API</a>. One of Haystac's records for the structure of Cephalosporin C points to Joe's review article.

Science fiction? Maybe. This is where the experiment comes in. Before I submitted the article on SVG, I manually annotated the SVG of Alprazolam with the corresponding InChI. The XML source can be viewed in Firefox by right-clicking on the SVG image and choosing <strong>This Frame->View Frame Source</strong>, or alternatively [here](/images/posts/20060907/alprazolam.svg). Below is a fragment of the XML:

```xml
<svg ...>
  <rdf:RDF
    xmlns:rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rdfs = "http://www.w3.org/2000/01/rdf-schema#"
    xmlns:dc = "http://purl.org/dc/elements/1.1/" >
    <rdf:Description about="http://depth-first.com"
      dc:title="InChI=1/C17H13ClN4/c1-11-20-21-16-10-19-17(12-5-3-2-4-6-12)14-9-13(18)7-8-15(14)22(11)16/h2-9H,10H2,1H3"
      dc:format="image/svg+xml"
      dc:language="en" >
      <dc:creator>
        <rdf:Bag>
          <rdf:li>Richard L. Apodaca</rdf:li>
        </rdf:Bag>
      </dc:creator>
    </rdf:Description>
  </rdf:RDF>

  <!-- etc. -->
</svg>
```

Today I <a href="http://www.google.com/search?hl=en&amp;q=%22Rendering+Molecules+with+SVG+on+the+Web%22&amp;btnG=Google+Search">searched</a> for the title of my article in Google and found it. I then searched for the InChI in the SVG metadata and <a href="http://www.google.com/search?hl=en&amp;lr=&amp;q=1%2FC17H13ClN4%2Fc1-11-20-21-16-10-19-17%2812-5-3-2-4-6-12%2914-9-13%2818%297-8-15%2814%2922%2811%2916%2Fh2-9H%2C10H2%2C1H3&amp;btnG=Search">did not find it</a>. Currently, a search of this InChI shows only one hit from the <a href="http://redpoll.pharmacy.ualberta.ca/drugbank/">DrugBank</a> database.

The experiment failed in its stated goal of getting the InChI of Alprazolam indexed by Google via the metadata in its SVG rendering. Was it the formatting of my RDF tags? Is metadata just indexed more slowly than other content? Does Google just ignore metadata to avoid <a href="http://www.clickz.com/showPage.html?page=3623139">keyword stuffing</a> by Search Engine Optimization tricksters? Are embedded SVG documents ignored by Google altogether? Whatever the reason, the <em>technical</em> barriers to a system like this working today are very low and dropping rapidly.