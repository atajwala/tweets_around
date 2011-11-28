class DisplayController < ApplicationController
	
  def home
  end

  def results
		# db.tweets.ensureIndex( { "geo.coordinates" : "2d" } )
		# db.tweets.find( { "geo.coordinates" : { $near: [ 40.24997883, -122.8188132 ] } } ).count()
		# rake db:mongoid:create_indexes
		if(params[:criteria] == CRITERIA[0])
			result = Geokit::Geocoders::GoogleGeocoder.geocode(params[:addr])
			latlng = result.ll.split(',')
			@mytweets = Tweet.near("geo.coordinates" => [ latlng[0].to_f, latlng[1].to_f ]).limit(params[:count].to_i)
		else
			#latlng = params[:addr].split(/\s\,\//)
			latlng = params[:addr].split(/[\s,\/]/)
			puts latlng
		  @mytweets = Tweet.near("geo.coordinates" => [ latlng[0].to_f, latlng[1].to_f ]).limit(params[:count].to_i)
		end
	  #@mytweets = Tweet.near("geo.coordinates" => [ params[:long].to_f, params[:lat].to_f ]).limit(params[:count].to_i)

	  respond_to do |format|
		  format.html
		  format.js 
		  format.json{
			      render :json => @mytweets.to_json
			}
		end
  end

end
