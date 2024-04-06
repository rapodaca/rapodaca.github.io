---
title: The RESTful Chemical Tracking System Part 5 - Media Types
published: "2009-09-10T00:00:00.000Z"
---

Laboratory information management systems are complex entities that evolve over time. Change takes many forms, including the support of new kinds of devices (e.g., [mobile devices](/articles/2009/09/04/tech-fridays-titanium-mobile-and-the-electronic-laboratory-notebook-usability-problem)), new applications that make use of the underlying data, changes in data models, and additional services that need to be integrated. RESTful web services exposing narrow functionality through a uniform interface offer an approach to anticipating and effectively working with these kinds of changes.

This article is the fifth part in a series exploring the idea that the REST architectural style can be applied to scientific laboratory information management problems, specifically chemical tracking. Previously, we identified five resources and described their interrelationships. This installment takes up the important question of how clients and servers will represent these resources through media types.

# All Articles in This Series:

1.  [The RESTful Chemical Tracking System Part 1: Introduction](/articles/2009/08/07/the-restful-chemical-tracking-system-part-1-introduction)
2.  [The RESTful Chemical Tracking System Part 2: Resources](/articles/2009/08/14/the-restful-chemical-tracking-system-part-2-resources)
3.  [The RESTful Chemical Tracking System Part 3: Resource Associations](/articles/2009/08/21/the-restful-chemical-tracking-system-part-3-resource-associations)
4.  [The RESTful Chemical Tracking System Part 4: Resources, Representations, Hypertext, and JSON](/articles/2009/08/28/the-restful-chemical-tracking-system-part-4-resources-representations-hypertext-and-json)
5.  The RESTful Chemical Tracking System Part 5: Media Types

# Resources At a Glance

We previously defined an [association diagram](/articles/2009/08/21/%EF%BB%BFthe-restful-chemical-tracking-system-part-3-resource-associations) that depicts how each of our resources relates to the others:

![CTS](/images/posts/20090820/cts.png "CTS")

# Using Media Types with Hypertext-driven APIs

As [previously described]](/articles/2009/08/28/%EF%BB%BFthe-restful-chemical-tracking-system-part-4-resources-representations-hypertext-and-json), media types for this chemical tracking system will be based on [JSON](http://www.json.org/). Because our API will be [hypertext-driven](/articles/2009/07/31/restful-web-services-hypermedia-and-robot-scientists), we'll need a mechanism for providing links for clients to follow. We'll do this by defining a JSON data structure called **Link**. A **Link** will communicate three things: (1) a URI; (2) a media type; (3) a human-readable name to aid in debugging and client development. The following is an example of a **Link** defined in JSON:

```bash
{
  "name":"human-readable description of this Link",
  "uri":"http://example.com/transfers/123",
  "media_type":"application/vnd.com.metamolecular.cts.Transfer+json"
}
```

When a client receives a representation containing a **Link**, it won't need to guess the media type to send or request from the server - it uses the media type supplied in the Link. For its part, the server can define as many media types for a given URI as it cares to without breaking any client code.

# Media Type Descriptions

Everything is now in place to offer some specific media type descriptions for the chemical tracking system. They each follow the same pattern consisting of: (1) a text description of the resource; (2) a table listing attributes and Links; and (3) an example representation.

Within each attributes table, those attributes marked "[create]" can be used when creating a new resource, and those marked "[update]" can be used when updating a resource. All attributes are returned when viewing the representation.

# #Index [application/vnd.com.metamolecular.cts.Index+json]

A listing of resources of the same type and which supports pagination.

<table width="100%" border=1><tr><th> Field Name
    </th><th> Type
    </th><th> Occurs
    </th><th> Description
  </th></tr>
  <tr><td> create
    </td><td> Link
    </td><td> 1
    </td><td> Create a new item.
  </td></tr>
  <tr><td> items
    </td><td> [Link]
    </td><td> 1
    </td><td> An array of Links that may be empty.
  </td></tr>
  <tr><td> next_page
    </td><td> Link
    </td><td> 0..1
    </td><td> Next page of Links.
  </td></tr>
  <tr><td> previous_page
    </td><td> Link
    </td><td> 0..1
    </td><td> Previous page of Links.
  </td></tr>
</table>

```json
{
  "create": {
    "name":"create a new location",
    "uri":"http://example.com/locations",
    "media_type":"application/vnd.com.metamolecular.cts.Location+json"
  },
  "items": [
    {
      "name":"a location",
      "uri":"http://example.com/locations/991",
      "media_type":"application/vnd.com.metamolecular.cts.Location+json"
    },
    {
      "name":"a location",
      "uri":"http://example.com/locations/992",
      "media_type":"application/vnd.com.metamolecular.cts.Location+json"
    },
    {
      "name":"a location",
      "uri":"http://example.com/locations/993",
      "media_type":"application/vnd.com.metamolecular.cts.Location+json"
    }
  ],
  "next_page": {
    "name":"the next page of locations",
    "uri":"http://example.com/locations?page=3",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  },
  "previous_page": {
    "name":"the previous page of locations",
    "uri":"http://example.com/locations?page=1",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  }
}
```

# Location [application/vnd.com.metamolecular.cts.Location+json]

The place in which a Sample resides (or once resided). This simplistic definition may work for a small lab; we can accomodate [more complex arrangements](/articles/2009/08/14/%EF%BB%BFthe-restful-chemical-tracking-system-part-2-resources#comments) by breaking *Location* into subordinate resources such as *Building*, *Room*, *Rack*, and so on.

<table width="100%" border=1><tr><th> Field Name
    </th><th> Type
    </th><th> Occurs
    </th><th> Description
  </th></tr>
    <tr><td> location:building
    </td><td> String
    </td><td> 1
    </td><td> Name of the building. [create, update]
  </td></tr>
    <tr><td> location:room
    </td><td> Integer
    </td><td> 1
    </td><td> Room number. [create, update]
  </td></tr>
    <tr><td> location:station_type
    </td><td> String
    </td><td> 1
    </td><td> Type of station, for example "Fume Hood." [create, update]
  </td></tr>
    <tr><td> location:station
    </td><td> Integer
    </td><td> 1
    </td><td> Station identifier, for example "27-A". [create, update]
  </td></tr>
  <tr><td> current_samples
    </td><td> Link
    </td><td> 1
    </td><td> Listing of Samples currently found at this Location.
  </td></tr>
  <tr><td> transfers
    </td><td> Link
    </td><td> 1
    </td><td> Listing of Transfers associated with this Location.
  </td></tr>
  <tr><td> update
    </td><td> Link
    </td><td> 0..1
    </td><td> Update the state of this Location.
  </td></tr>
  <tr><td> destroy
    </td><td> Link
    </td><td> 0..1
    </td><td> Destroy this Location.
  </td></tr>
</table>

```json
{
  "location": {
    "building":"Chemistry",
    "room":104,
    "station_type":"Fume Hood",
    "station":"27-A"
  }
  "current_samples": {
    "name":"samples currently stored at this location",
    "uri":"http://example.com/locations/123/samples",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  },
  "transfers": {
    "name":"transfers made to this location",
    "uri":"http://example.com/locations/123/transfers",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  },
  "update": {
    "name":"updates this location",
    "uri":"http://example.com/locations/123",
    "media_type":"application/vnd.com.metamolecular.cts.Location+json"
  },
  "destroy": {
    "name":"destroy this location",
    "uri":"http://example.com/locations/123",
    "media_type":"application/vnd.com.metamolecular.cts.Location+json"
  }
}
```

# Transfer [application/vnd.com.metamolecular.cts.Transfer+json]

The act of a User moving a Sample from one Location to another. Notice that unlike other resources, a Transfer is not something we can physically interact with but instead something done to another resource. Note that the *sample\_reference* and *location\_reference* fields make use of URIs themselves as primary resource identifiers.

<table width="100%" border=1><tr><th> Field Name
    </th><th> Type
    </th><th> Occurs
    </th><th> Description
  </th></tr>
    <tr><td> transfer:created_at
    </td><td> Datetime
    </td><td> 1
    </td><td> Time and date of transfer.
  </td></tr>
    <tr><td> transfer:sample_reference
    </td><td> URI
    </td><td> 1
    </td><td> The URI of the Sample being transfered. [create]
  </td></tr>
    <tr><td> transfer:location_reference
    </td><td> URI
    </td><td> 1
    </td><td> The URI of the Location for this transfer. [create]
  <tr><td> user
    </td><td> Link
    </td><td> 1
    </td><td> The user initiating the transfer.
  </td></tr>
  <tr><td> location
    </td><td> Link
    </td><td> 1
    </td><td> The location to which the transfer was made.
  </td></tr>
  <tr><td> sample
    </td><td> Link
    </td><td> 1
    </td><td> The Sample that was transferred.
  </td></tr>
  <tr><td> destroy
    </td><td> Link
    </td><td> 0..1
    </td><td> Destroy this Transfer.
  </td></tr>
</table>

```json
{
  "transfer": {
    "created_at":"Fri, 04 Sep 2009 18:44:44 +0000",
    "location_reference":"http://example.com/locations/123",
    "sample_reference":"http://example.com/samples/1234"
  },
  "user": {
    "name":"the user initiating this transfer",
    "uri":"http://example.com/users/123",
    "media_type":"application/vnd.com.metamolecular.cts.User+json"
  },
  "location": {
    "name":"the location to which the transfer was made",
    "uri":"http://example.com/locations/123",
    "media_type":"application/vnd.com.metamolecular.cts.Location+json"
  },
  "sample": {
    "name":"the sample being transferred",
    "uri":"http://example.com/samples/1234",
    "media_type":"application/vnd.com.metamolecular.cts.Sample+json"
  },
  "destroy": {
    "name":"destroy this transfer",
    "uri":"http://example.com/transfers/1234",
    "media_type":"application/vnd.com.metamolecular.cts.Transfer+json"
  }
}
```

# User [application/vnd.com.metamolecular.cts.User+json]

Any entity capable of moving a Sample from one Location to another. Depending on the equipment available in a lab, a User may or may not be a person.

<table width="100%" border=1><tr><th> Field Name
    </th><th> Type
    </th><th> Occurs
    </th><th> Description
  </th></tr>
    <tr><td> user:name
    </td><td> String
    </td><td> 1
    </td><td> This user's name. [create, update]
  </td></tr>
    <tr><td> user:type
    </td><td> String
    </td><td> 1
    </td><td> One of (Human|Robot) [create, update]
  </td></tr>
  <tr><td> transfers
    </td><td> Link
    </td><td> 1
    </td><td> Listing of all transfers made by this user.
  </td></tr>
  <tr><td> update
    </td><td> Link
    </td><td> 0..1
    </td><td> Update the state of this User.
  </td></tr>
  <tr><td> destroy
    </td><td> Link
    </td><td> 0..1
    </td><td> Destroy this User.
  </td></tr>
</table>

```json
{
  "user": {
    "name":"Xanthus-1",
    "type":"Robot"
  },
  "transfers": {
    "name":"the transfers made by this user",
    "uri":"http://example.com/users/123/transfers",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  },
  "update": {
    "name":"update this user",
    "uri":"http://example.com/users/123",
    "media_type":"application/vnd.com.metamolecular.cts.User+json"
  },
  "destroy": {
    "name":"destroy this user",
    "uri":"http://example.com/users/123",
    "media_type":"application/vnd.com.metamolecular.cts.User+json"
  }
}
```

# #Sample [application/vnd.com.metamolecular.cts.Sample+json]

The physical object we want to keep track of. We'll start with something simple here. But like *Location*, *Sample* is a resource we can refine by breaking it down into smaller resources. For example, we might enable a *Sample* to be divided by defining a *Partition* resource.

<table width="100%" border=1><tr><th> Field Name
    </th><th> Type
    </th><th> Occurs
    </th><th> Description
  </th></tr>
    <tr><td> sample:mass
    </td><td> String
    </td><td> 1
    </td><td> The mass of the Sample. [create, update]
  </td></tr>
  <tr><td> transfers
    </td><td> Link
    </td><td> 1
    </td><td> Listing of all transfers involving this Sample.
  </td></tr>
  <tr><td> current_location
    </td><td> Link
    </td><td> 1
    </td><td> The current location of this sample.
  </td></tr>
  <tr><td> substance
    </td><td> Link
    </td><td> 1
    </td><td> The Substance making up this Sample.
  </td></tr>
  <tr><td> update
    </td><td> Link
    </td><td> 0..1
    </td><td> Update the state of this Sample.
  </td></tr>
  <tr><td> destroy
    </td><td> Link
    </td><td> 0..1
    </td><td> Destroy this Sample.
  </td></tr>
</table>

```json
{
  "sample": {
    "mass":"275 mg"
  },
  "transfers": {
    "name":"the transfers involving this sample",
    "uri":"http://example.com/samples/1143/transfers",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  }
  "current_location": {
    "name":"the current location this sample",
    "uri":"http://example.com/locations/42",
    "media_type":"application/vnd.com.metamolecular.cts.Location+json"
  },
  "substance": {
    "name":"the substance making up this sample",
    "uri":"http://example.com/substances/1099",
    "media_type":"application/vnd.com.metamolecular.cts.Substance+json"
  },
  "update": {
    "name":"updates this sample",
    "uri":"http://example.com/samples/1234",
    "media_type":"application/vnd.com.metamolecular.cts.Sample+json"
  },
  "destroy": {
    "name":"destroy this sample",
    "uri":"http://example.com/samples/1234",
    "media_type":"application/vnd.com.metamolecular.cts.Sample+json"
  }
}
```

# Substance [application/vnd.com.metamolecular.cts.Substance+json]

The molecular entity (or entities) contained in a Sample. Here, we'll use a Substance ID assigned by another system (possibly by a company-wide substance registration app). If that system were RESTful (see [Chemcaster](http://chemcaster.com)), we could link to it instead.

<table width="100%" border=1><tr><th> Field Name
    </th><th> Type
    </th><th> Occurs
    </th><th> Description
  </th></tr>
    <tr><td> substance:identifier
    </td><td> String
    </td><td> 1
    </td><td> Substance ID. [create, update]
  </td></tr>
  <tr><td> samples
    </td><td> Link
    </td><td> 1
    </td><td> The samples in which this substance appears.
  </td></tr>
  <tr><td> update
    </td><td> Link
    </td><td> 0..1
    </td><td> Update the state of this Substance.
  </td></tr>
  <tr><td> destroy
    </td><td> Link
    </td><td> 0..1
    </td><td> Destroy this Substance.
  </td></tr>
</table>

```json
{
  "substance": {
    "identifer":"CB-10779751"
  },
  "samples": {
    "name":"the samples in which this substance appears",
    "uri":"http://example.com/substances/815/samples",
    "media_type":"application/vnd.com.metamolecular.cts.Index+json"
  },
  "update": {
    "name":"update this substance",
    "uri":"http://example.com/substances/123",
    "media_type":"application/vnd.com.metamolecular.cts.Substance+json"
  },
  "destroy": {
    "name":"destroy this substance",
    "uri":"http://example.com/substances/123",
    "media_type":"application/vnd.com.metamolecular.cts.Substance+json"
  }
}
```

# Conclusions

We now have the blueprint for a RESTful chemical tracking system. Five resources with well-defined relationships can now be expressed in terms of simple media types. But how do we use these media types and resources to actually accomplish something useful? The next article in this series will offer some ideas.