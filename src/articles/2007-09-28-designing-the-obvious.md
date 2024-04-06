---
title: "Designing the Obvious"
published: "2007-09-28T00:00:00.000Z"
---

Designing good user interfaces is difficult work. One of the hardest things about it is what you're forced to give up: abandoning your hard-won mental map and adopting that of the user; stripping half the product's features - and then stripping half of what's left; and fending off [featuritis](http://headrush.typepad.com/creating_passionate_users/2005/06/featuritis_vs_t.html) with a big club as the product matures. Everyone knows these things are important, but for some reason we repeat the same mistakes over and over.

So it was with great enthusiasm that I found Robert Hoekman, Jr.'s new book [*Designing the Obvious*](http://www.rhjr.net/dto). Good technical books collect illustrative examples and present them clearly. But great technical books provide a system for understanding the examples. *Designing the Obvious* is one of them.

As an example, have you ever considered a confirmation dialog to be a symptom of a fundamentally flawed application design? The next time you find yourself needing one of these doodads, consider this passage:

> The only implementation-model piece of design I've seen while using Backpack is the JavaScript alert message that pops open when I attempt to delete something from a Backpack page. It asks, simply, "Are You Sure?"
>
> While the message is a pretty standard confirmation message - which we're all used to seeing - it's a sign of the underlying system. It's a big ol' banner that says "I don't have an undo feature and the only way I can deal with you deleting an object from your page is to interrupt your workflow with this message to make sure you know what you're doing."

Hoekman's solution is simple - give your users an undo feature and ditch the confirmation dialog. This makes perfect sense, but how many times has the opposite been done instead?

Sometimes the obvious is far from obvious.
