class LocationsController < ApplicationController
    def create

        data = JSON(params[:loc_data])
        # render :text => data[0]["address_components"]
        location = Location.new(name: params[:loc_name], latitude: params[:latitude],
            longitude: params[:longitude], address: params[:address], user: User.find(current_user.id), data: data)
        if location.save
            redirect_to "/users"
        else
            flash[:error] = "You must add a valid location. Search below!"
            redirect_to "/users"
        end
    end
    def search
        location = Location.find(params[:id])
        # coordinates = { latitude: location.latitude, longitude: location.longitude}
        # parameters = { term: 'New York'}
        #ender :text => location.latitude.is_a?(Float)
        coordinates = { latitude: location.longitude, longitude: location.latitude }
        params = { term: location.name,
           limit: 3
         }

        locale = { lang: 'en' }
        website = Yelp.client.search_by_coordinates(coordinates, params, locale)
        # render json: website
        redirect_to "#{website.businesses[0].mobile_url}"
    end
end
