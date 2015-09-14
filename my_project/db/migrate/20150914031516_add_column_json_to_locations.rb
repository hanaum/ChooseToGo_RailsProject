class AddColumnJsonToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :data, :text
  end
end
