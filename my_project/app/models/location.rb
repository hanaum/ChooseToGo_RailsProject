class Location < ActiveRecord::Base
    belongs_to :user
    has_many :likes, dependent: :destroy
    has_many :users_liked, through: :likes, source: :user
    validates :name, presence: true
end
