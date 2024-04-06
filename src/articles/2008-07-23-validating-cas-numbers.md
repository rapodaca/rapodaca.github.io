---
title: Validating CAS Numbers
published: "2008-07-23T00:00:00.000Z"
---

The Chemical Abstracts Service (CAS) [registry number system](http://en.wikipedia.org/wiki/CAS_registry_number) was designed to be fault-tolerant. Built into every CAS number is a [check-digit](http://www.cas.org/expertise/cascontent/registry/checkdig.html) that makes it possible to detect mis-typed numbers. Validation is a mathematical and repetitive process well-suited for software.

The Ruby program below validates arbitrary CAS numbers:

```ruby
module CAS
  def validate cas_number
    return false unless cas_number && cas_number.match(/[0-9]{2,7}-[0-9]{2}-[0-9]/)

    check_digit = cas_number[-1,1].to_i
    sum = 0

    cas_number.reverse.scan(/[0-9]/).each_with_index do |digit, i|
      sum = sum + digit.to_i * i
    end

    check_digit == sum.remainder(10)
  end
end

include CAS

while true do
  print "CAS Number: "

  cas_number = gets.strip

  break if cas_number.empty?

  puts CAS.validate(cas_number) ? "valid" : "invalid"
end
</pre>

The program can be tested from the command line:

<pre class="console">
$ ruby cas.rb
CAS Number: 107-07-3
valid
CAS Number: 107-87-3
invalid
CAS Number:
```

Note that a validated CAS number can still be absent from the CAS database; validation only says that a CAS number *could* be valid based on its format.
