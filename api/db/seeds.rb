# ==============================================================================
# Organizations
# ==============================================================================
bear_creek = Organization.find_or_create_by!(slug: "bear-creek") do |org|
  org.name = "Bear Creek Ranch"
  org.status = "active"
end

# ==============================================================================
# Horses
# ==============================================================================
horses_data = [
  {
    name: "Shadow of Gotham",
    slug: "shadow-of-gotham",
    registry_id: "ST-001",
    breed: "Arabian",
    color: "Black",
    sex: "stallion",
    foaled_year: 2018,
    status: "active"
  },
  {
    name: "Desert King",
    slug: "desert-king",
    registry_id: "ST-002",
    breed: "Thoroughbred",
    color: "Bay",
    sex: "stallion",
    foaled_year: 2015,
    status: "reserved"
  },
  {
    name: "Midnight Queen",
    slug: "midnight-queen",
    registry_id: "ST-003",
    breed: "Quarter Horse",
    color: "Dark Bay",
    sex: "mare",
    foaled_year: 2019,
    status: "active"
  },
  {
    name: "Storm Runner",
    slug: "storm-runner",
    registry_id: "ST-004",
    breed: "Appaloosa",
    color: "Spotted",
    sex: "stallion",
    foaled_year: 2017,
    status: "active"
  }
]

horses_data.each do |data|
  bear_creek.horses.find_or_create_by!(slug: data[:slug]) do |h|
    h.assign_attributes(data)
  end
end

puts "Seeded #{Organization.count} organizations and #{Horse.count} horses."
