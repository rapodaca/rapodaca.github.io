# Depth-First

A blog mostly about cheminformatics, but sometimes other stuff.

Depth-First articles take a lot of effort. They usually require some level of outside research, experimentation, or creation. It's really hard to do this in one go. What follows is an attempt to systematize the publication of high-quality, on-budget articles.

The place to manage this kind of work is the `pending` directory. Its contents are split into three subdirectories, each with a specific purpose.

The goal is to allow for the evolution and critical evaluation of articles together. In particular, expensive rewrites in which some crucial underlying concept is discovered late in the process should be avoided.

## Concept

The first stage of writing an article is a *concept*. A concept is a markdown document consisting of:

1. A working title.
2. Enables. What the eventual article makes possible.
3. Requires. What the eventual article requires.
4. Freeform notes. A mixture of bulleted and unbulleted notes, probably including links.

The Concepts directory is not a place to dump information about interesting papers. Use Zotero notes for that.

## Spec

When a concept has accumulated sufficient detail and importance, a *spec* can be prepared. A spec is a markdown document consisting of:

1. A title.
2. Enables & Requires.
3. Hook. 1-2 paragraphs that will interest SAM in reading the article.
4. Section Headings. Includes "Conclusion."
5. Section outlines.
6. Notes. Anything that doesn't fit under a heading.

## Draft

When the Notes section of a spec is empty, a *draft* may be prepared. A draft is an important piece of writing of between 500 and 4,000 words, consisting of the following:

1. A title.
2. Benefits & Dependencies.
3. Hook.
4. Section Headings
5. Section text. Figures may be left as captions.

## Article

When all images have been added to figure captions, an article may be prepared. An article is is a document that will be published to the blog, and may be later revised.

Concepts, Specs, and Drafts that lose importance should be retired.

## Topics

Topics should be preferentially chosen for their ability to develop or promote something I'm personally working on, or which Metamolecular is developing/selling, or which a customer has revealed as important. Other topics are de-prioritized. They can be considered, but only after every other topic has been exhausted. Depth-First is not a news feed.

## Finding Ideas

The `drafts` directory might be empty or running low. If it is, consider these sources for new drafts:

- Previous articles. Have I learned something new? If I cite a Wikipedia article, can I write something better and cite that instead?
- Zotero collection. You added the papers there because they interested you at one time. Try organizing it, for example. This forces you to take another look.
- Popular HN threads. You might want to get some ideas for sort of off-topic posts. Summarize a popular thread. You know there will be an audience.
  - [find popular HN threads](https://hn.algolia.com/?dateRange=all&page=0&prefix=false&query=&sort=byPopularity&type=all)
  - [see how posts from the same site fare](https://news.ycombinator.com/item?id=29546769)
- Blogs
  - [Is Life Worth Living?](https://iwatobipen.wordpress.com)
  - [Cheminformatics 2.0](https://cheminf20.org)
  - [Practical Cheminformatics](https://practicalcheminformatics.blogspot.com)
  - [Efficient Bits](http://efficientbits.blogspot.com)
  - [O'Blog](https://baoilleach.blogspot.com)
- Standing conferences
  - [Cambridge Informatics Meetings](https://www.youtube.com/playlist?list=PLfj_gc4RCduuwv9p8lh2xS1EhQ3p_Nd9S)
- What can get readers hired as consultants?
- What can get me more customers for products?
- What are you working on right this minute?
  - Evergreen source, feed two birds with one loaf
- What have you already documented elsewhere?
- Journals. Don't forget older articles.
  - ChemArxiv
  - JCIM
  - J. Cheminformatics
- Q&A
  - Biostars
  - Stack Overflow
  - Chemistry Stack Exchange
  - [RDKit Question Issues](https://github.com/rdkit/rdkit/issues?q=label%3Aquestion+)
- Google
  - Find the top hit on a topic and write a better article.
- Chemical Reviews
