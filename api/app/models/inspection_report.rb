class InspectionReport < ApplicationRecord
  belongs_to :organization
  belongs_to :horse
  belongs_to :document, optional: true

  validates :title, :report_cid, :report_sha256, presence: true
end
