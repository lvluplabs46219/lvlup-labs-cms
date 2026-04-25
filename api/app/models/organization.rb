class Organization < ApplicationRecord
  enum :status, { active: "active", inactive: "inactive", archived: "archived" }

  has_many :users,              dependent: :destroy
  has_many :contacts,           dependent: :destroy
  has_many :assets,             dependent: :destroy
  has_many :documents,          dependent: :destroy

  # Bear Creek domain
  has_many :horses,             dependent: :destroy
  has_many :horse_pedigrees,    dependent: :destroy
  has_many :horse_documents,    dependent: :destroy
  has_many :inspection_reports, dependent: :destroy
  has_many :exclusive_listings, dependent: :destroy

  # PerformAir domain
  has_many :parts,                    dependent: :destroy
  has_many :suppliers,                dependent: :destroy
  has_many :inventory_items,          dependent: :destroy
  has_many :traceability_documents,   dependent: :destroy
  has_many :rfqs,                     dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9-]+\z/ }
end
