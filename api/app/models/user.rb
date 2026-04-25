class User < ApplicationRecord
  enum :role, { admin: "admin", sales: "sales", ops: "ops" }

  belongs_to :organization

  has_many :uploaded_documents, class_name: "Document", foreign_key: :uploaded_by_user_id, dependent: :nullify
  has_many :uploaded_assets,    class_name: "Asset",    foreign_key: :uploaded_by_user_id, dependent: :nullify

  validates :email, presence: true, uniqueness: { scope: :organization_id }
end
