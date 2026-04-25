class EnableExtensions < ActiveRecord::Migration[8.1]
  def change
    enable_extension "pgcrypto"   # gen_random_uuid()
    enable_extension "uuid-ossp"  # uuid_generate_v4() fallback
  end
end
