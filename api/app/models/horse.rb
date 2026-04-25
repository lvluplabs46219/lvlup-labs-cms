class Horse < ApplicationRecord
  enum :sex,    { mare: "mare", stallion: "stallion", gelding: "gelding", filly: "filly", colt: "colt" }
  enum :status, { active: "active", for_sale: "for_sale", reserved: "reserved",
                  sold: "sold", retired: "retired", deceased: "deceased", archived: "archived" }

  belongs_to :organization
  belongs_to :hero_asset, class_name: "Asset", optional: true

  has_one  :horse_pedigree,    dependent: :destroy
  has_many :horse_documents,   dependent: :destroy
  has_many :inspection_reports, dependent: :destroy
  has_many :exclusive_listings, dependent: :nullify

  validates :name, :registry_id, :breed, presence: true
  validates :slug, presence: true, uniqueness: { scope: :organization_id }
end
