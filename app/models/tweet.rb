class Tweet
  include Mongoid::Document
  store_in :tweets, capped: true, size: 250000000
 	embeds_one :geo

	index(
	  	[
					[ "geo.coordinates", Mongo::GEO2D ]
			], background: true
	)
end

class Geo
	include Mongoid::Document
  field :coordinates, :type => Array
	embedded_in :tweet
end

=begin
class Tweet
  include Mongoid::Document
  store_in :tweets, capped: true, size: 250000000
 	embeds_one :geo

	index(
	  	[
					[ :coordinates, Mongo::GEO2D ]
			], background: true
	)
end

class Geo
	include Mongoid::Document
  field :coordinates, :type => Array
	embedded_in :tweet
end
=end