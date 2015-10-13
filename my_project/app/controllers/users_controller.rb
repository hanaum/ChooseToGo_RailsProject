class UsersController < ApplicationController
    def new
    end
    def create
        user = User.new(first_name: params[:first_name], last_name: params[:last_name],
            email: params[:email], password: params[:password], description: params[:description])
        if user.save
            session[:id] = user.id
            redirect_to "/users"
        else
            flash[:errors] = user.errors.full_messages
            redirect_to '/users/new'
        end
    end
    def index
        locations = Location.where(user: User.find(current_user.id))
        @locations = [];
        locations.each do |loc|
            # render :text => loc.latitude
            if loc.visited == 0
                @locations << loc
            end
        end

    end
    def history
        locations = Location.where(user: User.find(current_user.id))
        @locations = [];
        locations.each do |loc|
            if loc.visited == 1
                @locations << loc
            end
        end
    end
end
