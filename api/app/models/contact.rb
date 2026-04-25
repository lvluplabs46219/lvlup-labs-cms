class Contact < ApplicationRecord
  belongs_to :organization
  has_many :suppliers, dependent: :nullify

  validates :name, presence: true
end
