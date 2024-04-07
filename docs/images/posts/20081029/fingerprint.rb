require 'rubygems'
require 'active_record'
require 'compound'

ActiveRecord::Base.establish_connection(
  :adapter    => 'mysql',
  :host       => 'localhost',
  :username   =>  'root',
  :password   =>  '',
  :database   =>  'compounds'
)

class Fingerprint < ActiveRecord::Base
  has_many :compounds
  
  @@bytes_prefix = "byte"
  
  def each_byte
    0.upto(byte_count - 1) {|i| yield send("#{@@bytes_prefix}#{i}")  }
  end
  
  def each_byte_with_index
    0.upto(byte_count - 1) {|i| yield send("#{@@bytes_prefix}#{i}"), i  }
  end
  
  def fill_bytes
    0.upto(byte_count - 1) {|i| send("#{@@bytes_prefix}#{i}=", yield(i))}
    
    self
  end
  
  def to_byte_array
    Array.new(16).fill{|i| send("#{@@bytes_prefix}#{i}")}
  end
  
  def byte_count
    result = 0
    
    while respond_to? "#{@@bytes_prefix}#{result}"
      result += 1
    end
    
    result
  end
  
  def bitstring
    result = ""
    
    each_byte {|byte| result +=  sprintf("%064b", byte)}
    
    result
  end
  
  def cardinality
    bitstring.count("1")
  end
  
  def eql?(other)
    to_byte_array.eql?(other.to_byte_array)
  end
  
  def save
    return false unless Fingerprint.find_by_fingerprint(self).empty?

    super
  end

  def self.find_by_fingerprint fingerprint
    Fingerprint.find_by_sql sql_for_find_by_fingerprint(fingerprint)
  end
  
  def self.find_children_by_fingerprint fingerprint
    Fingerprint.find_by_sql sql_for_find_children_by_fingerprint(fingerprint)
  end

  def self.sql_for_find_by_fingerprint fingerprint
    result = "select fingerprints.* from fingerprints where "
    last = fingerprint.byte_count - 1

    fingerprint.each_byte_with_index do |byte, i|
      result += "#{@@bytes_prefix}#{i}=#{byte}" + ((i ==last) ? "" : " and ")
    end

    result
  end
  
  def self.sql_for_find_children_by_fingerprint fingerprint
    result = "select fingerprints.* from fingerprints where "
    last = fingerprint.byte_count - 1
    
    fingerprint.each_byte_with_index do |byte, i|
      result += "#{@@bytes_prefix}#{i}&#{byte}=#{byte}" + ((i ==last) ? "" : " and ")
    end
    
    result
  end
end
