FROM ruby:3.2.11-slim

# Install PostgreSQL client, build dependencies, and YAML dev headers
RUN apt-get update -qq && apt-get install -y \
    postgresql-client \
    build-essential \
    libyaml-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /rails

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 4 --retry 3

# Copy the rest of the application
COPY . .

EXPOSE 4000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "4000"]
