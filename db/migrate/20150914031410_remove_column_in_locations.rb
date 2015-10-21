class RemoveColumnInLocations < ActiveRecord::Migration
  def change
    remove_column :locations, :data, :binary
  end
end
