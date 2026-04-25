class Asset < ApplicationRecord
  belongs_to :organization
  belongs_to :uploaded_by_user, class_name: "User", optional: true

  has_many :horses, foreign_key: :hero_asset_id, dependent: :nullify

  validates :kind, :url, presence: true
end
