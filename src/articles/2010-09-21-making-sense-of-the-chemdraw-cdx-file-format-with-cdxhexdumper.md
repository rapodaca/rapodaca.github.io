---
title: "Making Sense of the ChemDraw CDX File Format with CDXHexDumper"
disqus: true
published: "2010-09-21T00:00:00.000Z"
---

ChemDraw CDX is the native file format of CambridgeSoft's [ChemDraw](http://www.cambridgesoft.com/software/ChemDraw/) application. A previous article discussed the [importance of ChemDraw CDX to the business and science of chemistry](http://depth-first.com/articles/2010/09/13/a-brief-introduction-to-the-chemdraw-cdx-file-format). Another described how to [use Open Babel to read (at least in part) CDX files](http://depth-first.com/articles/2010/09/17/reading-and-translating-chemdraw-cdx-files-with-openbabel). But if we're interested in an API for reading and manipulating ChemDraw CDX files with high-fidelity, we'll need to dig a little deeper into understanding the CDX format. This article offers one perspective on this topic.

# A Free Tool from CambridgeSoft

Understanding binary file formats is quite a bit more tricky than understanding text formats. Fortunately, CabridgeSoft offers a free tool that can help developers interested in creating CDX readers: [CDXHexDumper.exe](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/General.htm) (hereafter just 'Dumper').

Dumper accepts a CDX file and produces as output a text file in which the nesting of objects and attribute associations can be examined conveniently.

# Using Dumper

Dumper is launched by double-clicking on its icon in a Windows environment. This pulls up an empty MFC application window (ahh, the memories this conjures). File->Open opens a CDX file and dumps the output to c:\temp\dump.txt. Note that if your c: drive does not contain a 'temp' directory, you'll need to make one for Dumper to work.

Let's look at the the [benzene.cdx](http://github.com/metamolecular/fugu) example available from GitHub.

# Looking at Dumper's Output

Dumper produces this output for the 'benzene.cdx' file:

```bash
CDX Header: [8 bytes] VjCD0100
Backward compatibility: [4 bytes] 0x16909060
Nulls: [16 bytes] 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 0x0 
Property 0x0204 [16 bytes]  17 9c 67 01 a7 01 ed 00 6e 9c a3 01 b4 f7 20 01 
Property 0x0804 [4 bytes]  00 00 1e 00 
Property 0x0300 [14 bytes]  02 00 ff ff ff ff ff ff 00 00 00 00 00 00 
Property 0x0100 [19 bytes]  01 00 01 00 01 00 10 27 09 00 53 61 6e 73 53 65 72 69 66 
Object 0x8001 [6 bytes]  with Object ID 0x2
|   Object 0x8003 [6 bytes]  with Object ID 0x3
|   |   Property 0x0204 [16 bytes]  17 9c 67 01 a7 01 ed 00 6e 9c a3 01 b4 f7 20 01 
|   |   Object 0x8004 [6 bytes]  with Object ID 0x4
|   |   |   Property 0x0200 [8 bytes]  17 9c 67 01 ad fc 06 01 
|   |   |   Property 0x0402 [2 bytes]  06 00 
|   |   |   Property 0x0437 [1 bytes]  06 
|   |   ObjectEnd 0x8004/0x4
|   |   Object 0x8004 [6 bytes]  with Object ID 0x5
|   |   |   Property 0x0200 [8 bytes]  2d 9c 76 01 a7 01 ed 00 
|   |   |   Property 0x0402 [2 bytes]  06 00 
|   |   |   Property 0x0437 [1 bytes]  06 
|   |   ObjectEnd 0x8004/0x5
|   |   Object 0x8004 [6 bytes]  with Object ID 0x6
|   |   |   Property 0x0200 [8 bytes]  58 9c 94 01 a7 01 ed 00 
|   |   |   Property 0x0402 [2 bytes]  06 00 
|   |   |   Property 0x0437 [1 bytes]  06 
|   |   ObjectEnd 0x8004/0x6
|   |   Object 0x8004 [6 bytes]  with Object ID 0x7
|   |   |   Property 0x0200 [8 bytes]  6e 9c a3 01 ad fc 06 01 
|   |   |   Property 0x0402 [2 bytes]  06 00 
|   |   |   Property 0x0437 [1 bytes]  06 
|   |   ObjectEnd 0x8004/0x7
|   |   Object 0x8004 [6 bytes]  with Object ID 0x8
|   |   |   Property 0x0200 [8 bytes]  58 9c 94 01 b4 f7 20 01 
|   |   |   Property 0x0402 [2 bytes]  06 00 
|   |   |   Property 0x0437 [1 bytes]  06 
|   |   ObjectEnd 0x8004/0x8
|   |   Object 0x8004 [6 bytes]  with Object ID 0x9
|   |   |   Property 0x0200 [8 bytes]  2d 9c 76 01 b4 f7 20 01 
|   |   |   Property 0x0402 [2 bytes]  06 00 
|   |   |   Property 0x0437 [1 bytes]  06 
|   |   ObjectEnd 0x8004/0x9
|   |   Object 0x8005 [6 bytes]  with Object ID 0xa
|   |   |   Property 0x0604 [4 bytes]  04 00 00 00 
|   |   |   Property 0x0605 [4 bytes]  05 00 00 00 
|   |   |   Property 0x0600 [2 bytes]  01 00 
|   |   |   Property 0x0601 [2 bytes]  00 00 
|   |   ObjectEnd 0x8005/0xa
|   |   Object 0x8005 [6 bytes]  with Object ID 0xb
|   |   |   Property 0x0604 [4 bytes]  04 00 00 00 
|   |   |   Property 0x0605 [4 bytes]  09 00 00 00 
|   |   |   Property 0x0600 [2 bytes]  02 00 
|   |   |   Property 0x0601 [2 bytes]  00 00 
|   |   ObjectEnd 0x8005/0xb
|   |   Object 0x8005 [6 bytes]  with Object ID 0xc
|   |   |   Property 0x0604 [4 bytes]  05 00 00 00 
|   |   |   Property 0x0605 [4 bytes]  06 00 00 00 
|   |   |   Property 0x0600 [2 bytes]  02 00 
|   |   |   Property 0x0601 [2 bytes]  00 00 
|   |   ObjectEnd 0x8005/0xc
|   |   Object 0x8005 [6 bytes]  with Object ID 0xd
|   |   |   Property 0x0604 [4 bytes]  06 00 00 00 
|   |   |   Property 0x0605 [4 bytes]  07 00 00 00 
|   |   |   Property 0x0600 [2 bytes]  01 00 
|   |   |   Property 0x0601 [2 bytes]  00 00 
|   |   ObjectEnd 0x8005/0xd
|   |   Object 0x8005 [6 bytes]  with Object ID 0xe
|   |   |   Property 0x0604 [4 bytes]  07 00 00 00 
|   |   |   Property 0x0605 [4 bytes]  08 00 00 00 
|   |   |   Property 0x0600 [2 bytes]  02 00 
|   |   |   Property 0x0601 [2 bytes]  00 00 
|   |   ObjectEnd 0x8005/0xe
|   |   Object 0x8005 [6 bytes]  with Object ID 0xf
|   |   |   Property 0x0604 [4 bytes]  08 00 00 00 
|   |   |   Property 0x0605 [4 bytes]  09 00 00 00 
|   |   |   Property 0x0600 [2 bytes]  01 00 
|   |   |   Property 0x0601 [2 bytes]  00 00 
|   |   ObjectEnd 0x8005/0xf
|   ObjectEnd 0x8003/0x3
ObjectEnd 0x8001/0x2
ObjectEnd Empty/Empty
Eof read
```

Working with the [CDX documentation](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/IntroCDX.htm), we can begin to make some sense of Dumper's output.

The first thing to notice is that, like XML, for every start tag we find a matching end tag. Also noteworthy is how Dumper reveals the nested object structure of the CDX file.

Lines 1-3 make up the header section. Eight bytes (encoding 'VjCD0100') start the file off, followed by four reserved bytes and then sixteen reserved bytes that all encode '0'.

The fourth line represents the first content specific to our file. 'Property 0x0204' represents a [kCDXProp_BoundingBox](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/properties/BoundingBox.htm). This is the bounding box for the Page defined in this CDX file (see below). We can see from the documentation that the type of this property is a [CDXRectangle](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/DataType/CDXCoordinates.htm), which itself is composed of four four-byte [CDXCoordinates](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/DataType/CDXCoordinates.htm) arranged in the order: top; left; bottom; and right. Each CDXCoordinate is further defined as an [INT32](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/DataType/CDXNumeric.htm), specified in little-endian order.

In the case of the Dumper output, we see that the document's bounding box has a top value of '17 9c 67 01', or 23567383:

```bash
irb
>> '01679c17'.hex
=> 23567383
```

Likewise, the bottom value for the bounding box is '6e 9c a3 01' or 27499630. Apparently, we have a coordinate system in which the y-axis increases in the downward direction.

Line eight encodes the start tag for the [Page](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Page.htm) object itself ('Object 0x8001'). It should be clear that the page contains all of the other objects in this particular CDX file. The first of these is the [Fragment](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Fragment.htm), or the benzene molecule representation. This fragment is itself made up of six [Node objects](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Node.htm) (atoms) and six [Bond objects](http://www.cambridgesoft.com/services/documentation/sdk/chemdraw/cdx/Bond.htm).

# Summary

CDXHexDumper is a valuable utility for anyone wishing to explore the structure of CDX documents. A parser it's not, but this program provides plenty of clues for how to write one. But that's a story for another time.