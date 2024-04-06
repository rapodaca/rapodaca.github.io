---
title: Fighting Spam on the Cheap with CAPTCHA - A Simple Ruby Library for captchas.net
published: "2007-09-03T00:00:00.000Z"
---

A [recent article](/articles/2007/09/01/fighting-comment-spam-on-the-cheap-with-captcha) discussed two free services for cheaply integrating [CAPTCHAs](http://en.wikipedia.org/wiki/Captcha) into Web applications. One of these services, [captchas.net](http://captchas.net), apparently has no publicly-available Ruby library. Given the popularity of [Ruby on Rails](http://rubyonrails.com) for building Web applications, and the increasing need for spam protection offered by services such as [captchas.net](http://captchas.net), it seems only logical that such a library should exist. This article, the first in a series, documents the first step in the development of a simple Rails library for working with captchas.net.

# Got Key?

To use captchas.net, you'll need to [register for an account](http://captchas.net/registration/). You'll receive a secret key used in decoding the text represented in the CAPTCHA, and a username that will be encoded with your capthcas.net URLs.

# Building a URL

To get your CAPTCHA image from captchas.net, construct a URL containing the appropriate parameters. The simplest form of a captchas.net URL accepts your user name ('demo') and a random phrase ('my\_random\_text'), and returns a complete CAPTCHA image. Customization is possible, but we'll just stick with the simple case for now. As an example, this URL:

```bash
http://image.captchas.net/?client=demo&random=my_random_text
```

generates this image:

![Captcha](http://image.captchas.net/?client=demo&random=my_random_text "Captcha")

The URL above is all you need to embed a CAPTCHA into your webpage. The random text we've encoded in the URL ('my\_random\_text') is processed by the captchas.net server to create the six-character sequence shown in the image. Read on to find out how.

# Decoding the CAPTCHA

We've got a CAPTCHA, but how do we know what's written in it? This is where our secret key comes in. Here's the method used by the captchas.net server to generate the image text:

- concatenate the secret key and the random string (example: 'secret' and 'my\_random\_text' become 'secretmy\_random\_text')
- if <code>alphabet</code> or <code>character\_count</code> differs from 'abcdefghijklmnopqrstuvwxyz' and 6, respectively, append both separated by ':' (&lt;secret&gt;&lt;random&gt;:&lt;<code>alphabet</code>&gt;:&lt;<code>character_count</code>&gt;).
- take the MD5-sum of the resulting string
- take the first <code>character\_count</code> bytes of the resulting 16-byte-long MD5 value
- determine the remainders of this <code>character\_count</code> bytes, when dividing by the length of <code>alphabet</code>
- every number encodes a character from the chosen <code>alphabet</code> (example: "hnrppb")

The [captchas.net site](http://catpchas.net) has a more complete description of the algorithm and an interactive CAPTCHA generator that is very helpful in understanding how CAPTCHAs are generated.

# A Simple Library

Given the algorithm, a short Ruby library can be written to find the text encoded in a captchas.net CAPTCHA:

```ruby
require 'digest/md5'

module Captcha
  def get_text secret, random, alphabet='abcdefghijklmnopqrstuvwxyz', character_count = 6
    if character_count &lt; 1 || character_count &gt; 16
      raise "Character count of #{character_count} is outside the range of 1-16"
    end

    input = "#{secret}#{random}"

    if alphabet != 'abcdefghijklmnopqrstuvwxyz' || character_count != 6
      input &lt;&lt;  ":#{alphabet}:#{character_count}"
    end

    bytes = Digest::MD5.hexdigest(input).slice(0..(2*character_count - 1)).scan(/../)
    text = ''

    bytes.each do |byte|
      text &lt;&lt; alphabet[byte.hex % alphabet.size].chr
    end

    text
  end
end 
```

We can test the library using irb:

```bash
irb
irb(main):001:0> require 'captcha'
=> true
irb(main):002:0> include Captcha
=> Object
irb(main):003:0> get_text 'secret', 'my_random_text'
=> "hnrppb"
```

If we wanted to include numerical digits and require additional characters, the library enables this as well:

```bash
irb
irb(main):001:0> require 'captcha'
=> true
irb(main):002:0> include Captcha
=> Object
irb(main):003:0> get_text 'secret', 'my_random_text', 'abcdefghijklmnopqrstuvwxyz0123456789', 7
=> "62m3acs"
```

# Conclusions

That's really all there is to the Ruby library. Once we can create a CAPTCHA image and decode its contents, we can begin to think about building an integrated Rails solution. But that's a story for another time.

