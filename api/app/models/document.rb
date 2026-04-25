class Document < ApplicationRecord
  belongs_to :organization
  belongs_to :uploaded_by_user, class_name: "User", optional: true

  has_many :horse_pedigrees_as_source,   class_name: "HorsePedigree",  foreign_key: :source_document_id,   dependent: :nullify
  has_many :horse_pedigrees_as_metadata, class_name: "HorsePedigree",  foreign_key: :metadata_document_id, dependent: :nullify
  has_many :horse_documents,             foreign_key: :document_id,     dependent: :nullify
  has_many :inspection_reports,          foreign_key: :document_id,     dependent: :nullify
  has_many :traceability_documents,      foreign_key: :document_id,     dependent: :nullify

  validates :type, :title, :storage_url, presence: true
end
