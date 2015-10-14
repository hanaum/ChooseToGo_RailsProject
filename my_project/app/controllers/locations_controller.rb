class LocationsController < ApplicationController
    def create

        data = JSON(params[:loc_data])
        latitude = data[0]["latitude"]
        longitude = data[0]["longitude"]
        location = Location.new(name: params[:loc_name], latitude: latitude,
            longitude: longitude, address: params[:address], visited: 0, user: User.find(current_user.id), data: data)
        if location.save
            redirect_to "/users"
        else
            flash[:error] = "You must add a valid location. Search below!"
            redirect_to "/users"
        end
    end
    def search
        location = Location.find(params[:id])
        coordinates = { latitude: location.latitude, longitude: location.longitude }
        params = { term: location.name,
           limit: 3
         }

        locale = { lang: 'en' }
        website = Yelp.client.search_by_coordinates(coordinates, params, locale)
        redirect_to "#{website.businesses[0].mobile_url}"
    end
    def edit
        location = Location.find(params[:id])
        location.visited = 1;
        location.save
        redirect_to "/users";
    end
    def destroy
        location = Location.find(params[:id])
        location.destroy
        redirect_to "/users"
    end
end
