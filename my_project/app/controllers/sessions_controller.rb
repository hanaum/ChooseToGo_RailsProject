class SessionsController < ApplicationController
    def index
    end
    def new
        user = User.find_by(email: params[:email])
        if user && user.authenticate(params[:password])
            session[:id] = user.id
            redirect_to "/users/#{current_user.id}"
        else
            flash[:error] = "Invalid email/password confirmation"
            redirect_to "/users/create"
        end
    end
    def destroy
        session[:id] = nil
        redirect_to "/main"
    end
end
