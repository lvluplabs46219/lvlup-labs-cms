class ExclusiveListing < ApplicationRecord
  enum :status, { draft: "draft", private: "private", published: "published", sold: "sold" }

  belongs_to :organization
  belongs_to :horse, optional: true

  validates :title, :token_type, :chain_id, presence: true

  scope :published, -> { where(status: :published) }
end
