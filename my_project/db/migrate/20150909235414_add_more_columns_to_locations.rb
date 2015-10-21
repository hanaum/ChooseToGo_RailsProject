class AddMoreColumnsToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :latitude, :float
    add_column :locations, :longitude, :float
    add_column :locations, :description, :text
  end
end
