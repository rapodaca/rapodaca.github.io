---
title: My Favorite Eclipse Shortcut - Quick Fix
published: "2008-01-11T00:00:00.000Z"
---

[Eclipse](http://www.eclipse.org/) is one of those great tools that is both easy to learn and extremely powerful. Eclipse's power comes, in part, from the number of features it offers, which seems to grow with every new release. This creates a problem though; the more features that are added to Eclipse, the more difficult it is to find them. This article focuses on one feature that every Eclipse user should know about: [Quick Fix](http://help.eclipse.org/help31/index.jsp?topic=/org.eclipse.jdt.doc.user/tasks/tasks-175.htm).

Let's say you're creating a class from scratch and you need to add a variable. Because you're working in Java, you'll also need to specify a type. If that type is one that doesn't already appear in the file you're working on, you'll either need to create it or import it. It may not seem like a big deal to scroll to the top of your file, add an `import` statement, and scroll back down to continue writing, but it can really break the flow of concentration - especially considering that it may need to be done several times in just one method.

Wouldn't it be great if Eclipse could handle this tedium for you?

Enter [Quick Fix](http://help.eclipse.org/help31/index.jsp?topic=/org.eclipse.jdt.doc.user/tasks/tasks-175.htm). In this example, we're creating a class called `Molecule` and need to add a `List` to hold its atoms. We begin by declaring the `atoms` variable:

![List Error](/images/posts/20080111/list_error.png "List Error")

Eclipse recognizes that `List` is a new type. Instead of manually inserting an `import` statement at the top of the file, let's use Quick Fix.

Highlighting the error and pressing \[Ctrl-1\] opens Quick Fix and gives us a list of options to choose from:

![List Options](/images/posts/20080111/list_options.png "List Options")

Quick Fix can also create a class or interface template instead of importing a class, as the screenshot above suggests.

We need to import the `java.util.List` interface. Double clicking on the `Import 'List'(java.util)` option inserts the import statement and allows us to continue writing:

![List Fix](/images/posts/20080111/list_fix.png "List Fix")

Eclipse is packed with these kinds of useful but hard to find features. Future Depth-First articles will highlight some of them.