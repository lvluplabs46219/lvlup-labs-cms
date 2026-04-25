class CreateCoreTables < ActiveRecord::Migration[8.1]
  def change
    # --- Enums -----------------------------------------------------------
    create_enum :organization_status, %w[active inactive archived]
    create_enum :user_role, %w[admin sales ops]

    # --- organizations ---------------------------------------------------
    create_table :organizations, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string   :name,   null: false
      t.string   :slug,   null: false
      t.enum     :status, enum_type: :organization_status, null: false, default: "active"
      t.timestamps        null: false, default: -> { "now()" }
    end
    add_index :organizations, :slug, unique: true, name: "organizations_slug_idx"

    # --- users -----------------------------------------------------------
    create_table :users, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "users_organization_id_idx" }
      t.string     :email,          null: false
      t.string     :name
      t.enum       :role, enum_type: :user_role, null: false, default: "admin"
      t.string     :avatar_url
      t.string     :wallet_address
      t.timestamps null: false, default: -> { "now()" }
    end
    add_index :users, %i[organization_id email], name: "users_org_email_idx"

    # --- contacts --------------------------------------------------------
    create_table :contacts, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "contacts_organization_id_idx" }
      t.string  :name,    null: false
      t.string  :email
      t.string  :phone
      t.string  :company
      t.text    :notes
      t.datetime :created_at, null: false, default: -> { "now()" }
    end

    # --- assets ----------------------------------------------------------
    create_table :assets, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "assets_organization_id_idx" }
      t.references :uploaded_by_user, type: :uuid, foreign_key: { to_table: :users }
      t.string  :kind, null: false
      t.text    :url,  null: false
      t.string  :alt_text
      t.jsonb   :metadata
      t.datetime :created_at, null: false, default: -> { "now()" }
    end
    add_index :assets, :kind, name: "assets_kind_idx"

    # --- documents -------------------------------------------------------
    create_table :documents, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.references :organization, null: false, type: :uuid, foreign_key: true,
                   index: { name: "documents_organization_id_idx" }
      t.references :uploaded_by_user, type: :uuid, foreign_key: { to_table: :users }
      t.string  :type,        null: false
      t.string  :title,       null: false
      t.text    :storage_url, null: false
      t.string  :mime_type
      t.string  :sha256
      t.string  :ipfs_cid
      t.jsonb   :metadata
      t.datetime :created_at, null: false, default: -> { "now()" }
    end
    add_index :documents, :type, name: "documents_type_idx"
  end
end
