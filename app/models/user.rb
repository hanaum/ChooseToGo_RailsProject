class User < ActiveRecord::Base
    EMAIL_REGEX = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]+)\z/i
    has_secure_password
    validates :first_name, :last_name, presence: true
    validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }
    validates :password, presence: true, confirmation: true, length: {minimum: 5}
    has_many :locations
    has_many :likes, dependent: :destroy
    has_many :locations_likes, through: :likes, source: :location
end
