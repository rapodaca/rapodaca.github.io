---
title: "Rethinking the Command Line for Chemistry"
published: "2007-03-27T00:00:00.000Z"
---

A [recent article](http://depth-first.com/articles/2007/03/15/do-you-use-the-command-line) discussed the renaissance of the command line. Particularly on the Web, command line interfaces have become so advanced, that most of us don't even realize we're using them. Consider the Google search box, which is nothing more than one of the most powerful command line interfaces ever developed.

![YubNub](/images/posts/20070327/yubnub.png "YubNub")

A service called [YubNub](http://yubnub.org/) takes this idea one step further. YubNub is a meta command line interface for the Web. The following YubNub command will do a [Flickr](http://flickr.com) search for benzene.

![DucatiSearch](/images/posts/20070327/ducatisearch.png "DucatiSearch")

If this were all YubNub did, it would be merely interesting. What makes YubNub remarkable is that you can create your own commands that other people can use. I recently added the "ginchi" command to query Google for an InChI. Now you can try it out:

![BenzeneSearch](/images/posts/20070327/benzenesearch1.png "BenzeneSearch")

By itself this isn't particularly useful because you can just go to Google and query the InChI directly. However, it's not too hard to imagine several commands like <tt>ginchi</tt> that could be added. Some would use Google, others would use other services.  How about something that searches Mitch Garcia's [chemistry journal Yahoo pipe](http://www.sciencebase.com/science-blog/chemical-pipe-works.html)? It would be very convenient to have all of those commands accessible from the same Web page.

Command line interfaces can be phenomenally useful for both beginning and advanced users. The hardest part to get right is not what the user sees as they type, but what happens after they hit the enter key.

[Line notations](http://depth-first.com/articles/tag/linenotation) are the perfect match for command line interfaces. The widespread use of SMILES and the precision of InChI offer many possibilities for innovative chemistry Web services.