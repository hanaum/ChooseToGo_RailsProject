class Location < ActiveRecord::Base
    belongs_to :user
    has_many :likes, dependent: :destroy
    has_many :users_liked, through: :likes, source: :user
    validates :description, presence: true, length: { minimum: 10}
end
