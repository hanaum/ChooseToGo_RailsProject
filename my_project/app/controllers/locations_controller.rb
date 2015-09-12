class LocationsController < ApplicationController
    def create
        render :text => params
    end
end
