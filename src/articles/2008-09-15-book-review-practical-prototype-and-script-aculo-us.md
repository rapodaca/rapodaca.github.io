---
title: Book Review - Practical Prototype and script.aculo.us
published: "2008-09-15T00:00:00.000Z"
---

Technical books generally fall into one of two categories: tutorials, which rely on examples; and references, which use a high-level, architecture-centric perspective. If you prefer tutorials loaded with good examples framed in relevant context, then Andrew Dupont's [*Practical Prototype and script.aculo.us*](http://www.apress.com/book/view/9781590599198) may be worth reading.

The examples I find most useful in a technical book are short snippets of code that do something very specific and which are bracketed by concise discussion. This makes it possible to scan pages looking for the answer to an immediate question. *Practical Prototype* offers many examples of this style of writing.

I generally find long examples difficult to follow - if I miss one key concept (by scanning ahead over something I'm not interested in, for example), then the rest of the example isn't much use. Fortunately, *Practical Prototype* only contains two extended examples: a fantasy football league and a blog-like application. And both augment material found elsewhere in the book.

JavaScript is a tool that few of its users ever get any formal training in. This can make discussions of technologies based on JavaScript difficult to follow as each reader will have a different set of limitations in their basic understanding. *Practical Prototype* takes this into account by laying a solid, approachable foundation before diving into the framework details.

For example, Chapter One discusses the basics of the JavaScript language itself and its DOM manipulation capabilities. Chapter Nine reviews DHTML fundamentals. Many chapters begin by discussing how something could be accomplished with bare JavaScript before introducing the way it's done with Prototype and script.aculo.us. Chapter Three, which discusses Prototype's collections support, and Chapter Ten, which introduces script.aculo.us effects, both include especially effective uses of this technique.

Maintaining the focus to write in this style consistently is not easy, but this is what differentiates an academic, unapproachable book from one that readers at all levels of understanding can learn from. *Practical Prototype* does a good job of consistently providing the necessary context.

One of my favorite things about *Practical Prototype* is its use of [Firebug](https://addons.mozilla.org/en-US/firefox/addon/1843) as a way to both teach the process of doing JavaScript development and to understand the examples.

*Practical Prototype's* reliance on examples does come with a downside: the book doesn't work well as a reference. What are all of the methods added to <code>Array</code> by Prototype? What's the syntax for creating a class? What are all of the arguments that <code>morph</code> takes? What are the performance implications of using <code>getElementById</code> versus $? When *shouldn't* you use Prototype or script.aculo.us? The answers to these questions may exists, but you'd need to find the right example. Clearly, this was a concious decision by the author and makes sense to the extent that the [online API documentation](http://www.prototypejs.org/api) answers these questions. But if you need a reference on Prototype and script.aculo.us, this may not be the book for you.

In summary, if you're looking for a tutorial containing lots of illustrative examples bracketed by concise discussion, *Practical Prototype and scrip.aculo.us* is a good choice.

*Full Disclosure: I wrote this review as part of a program offered by [Apress](http://apress.com/) and [O'Reilly](http://oreilly.com/) to members of users groups - in my case the [San Diego Java Users Group](http://sdjug.org/). In exchange for writing a review - good, bad, or indifferent - I got a free copy of the book. My main interest is in the Prototype framework, which has been discussed previously [here](http://depth-first.com/articles/2008/08/28/javascript-for-cheminformatics-atom-typing-with-prototype-and-iterators) and [here](http://depth-first.com/articles/2008/08/26/javascript-for-cheminformatics-using-the-prototype-framework).*