class AddVisitedToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :visited, :integer
  end
end
