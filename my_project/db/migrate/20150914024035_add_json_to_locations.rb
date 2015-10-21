class AddJsonToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :data, :binary
  end
end
