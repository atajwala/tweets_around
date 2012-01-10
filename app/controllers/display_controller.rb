class DisplayController < ApplicationController
	
  def home
  end

=begin
		  db.tweets.ensureIndex( 
		    { "geo.coordinates" : "2d" } 
			)
			db.tweets.find( 
			  { "geo.coordinates" : 
			    => { $near: [ 40.24997883, -122.8188132 ] } } 
			).count()
			rake db:mongoid:create_indexes
=end

  def results
    if(params[:criteria] == CRITERIA[0])
      result = Geokit::Geocoders::GoogleGeocoder.geocode(params[:addr])

      if(result.success == false)
        render :file => 'invalid_address.js.erb' and return		
      end

      latlng = result.ll.split(',')
      @mytweets = Tweet.near(
                    "geo.coordinates" => 
                    [ latlng[0].to_f, latlng[1].to_f ]
                  ).limit(params[:count].to_i)								
    else
      latlng = params[:addr].split(/[\s,\/]/)
      puts latlng
      @mytweets = Tweet.near(
                    "geo.coordinates" => 
                    [ latlng[0].to_f, latlng[1].to_f ]
                  ).limit(params[:count].to_i)
    end
		
	  respond_to do |format|
		  format.html
		  format.js 
		  format.json{
			  render :json => @mytweets.to_json
      }
		end
  end

end
