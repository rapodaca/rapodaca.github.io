---
title: "Because Mistakes Happen: Giving ChemPhoto Some Poka-yoke"
published: "2008-09-17T00:00:00.000Z"
---

One of the difficulties in creating applications that can write to a user's filesystem is dealing with the real possibility that a simple, honest, garden-variety mistake can result in consequences ranging from the mildly frustrating to the disastrous.

As a specific example, consider Omar, who has just created 15,000 SVG images from an SD file with [ChemPhoto](http://metamolecular.com/chemphoto) (the first [chemical structure imaging application](http://depth-first.com/articles/2008/09/08/smarter-cheminformatics-from-sd-file-to-image-collection-with-chemphoto)). Continuing on, he opens a second SD file to create images from it. Forgetting to change the output directory for his images, Omar presses the "Create" button, only to find that the new images are overwriting the old images. By the time he presses "Cancel", the damage has been done. Omar has to go back to the first SD file and create all 15,000 SVG images again.

In his book *[Designing the Obvious](http://rhjr.net/dto/)*, Robert Hoekman, Jr. describes user interface elements designed to prevent the user from making mistakes. He calls them Poka-yoke devices (POH-kay YOH-kay, from the Japanese for "mistake-proofing").

It's possible to spare Omar from his self-inflicted inconvenience (or a far more serious kind of mistake) by building some Poka-yoke devices into ChemPhoto.

A single dialog box controls the generation of images in ChemPhoto. The image below shows that it requires a name for the collection. Notice that without this, the name field is highlighted, a message appears at the bottom, and the "Create" button is deactivated.

![Choose Name](/images/posts/20080917/choose_name_full.png "Choose Name")

If Omar chooses a non-existing output directory, he'll similarly get a warning and be prevented from continuing:

![Warning](/images/posts/20080917/warning_directory_full.png "Warning")

If Omar chooses a directory and collection name combination that will result in a directory (or archive file) being overwritten, he gets a warning and is blocked from going forward:

![Overwrite](/images/posts/20080917/warning_overwrite_full.png "Overwrite")

When Omar has provided all of the necessary information and there's no chance he can overwrite any of his existing files, ChemPhoto clears the error messages, removes the error highlighting, and activates the "Create" button (he's also told exactly what ChemPhoto will be writing to his hard drive):

![Alles Klar](/images/posts/20080917/alles_klar_full.png "Alles Klar")

This functionality could have been implemented by letting Omar fill in all the fields, with error or not. If some conflict (such a directory overwrite) were detected, Omar could get a warning dialog, and be told to go back to the form to fix it. But why put him to all that trouble when designing the right interface from the start can prevent it?

Catching errors as they occur and providing feedback in real-time gives the best of both worlds in a form that can be filled out quickly and safely.


