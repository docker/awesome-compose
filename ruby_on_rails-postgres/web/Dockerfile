FROM ruby:2.6.5

# install nodejs / libdev / postgres-client
RUN apt-get update -qq && apt-get install -y nodejs libpq-dev postgresql-client

## install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn && rm -rf /var/lib/apt/lists/*

RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

##
RUN gem install bundler:2.0.2
RUN bundle check || bundle install
RUN yarn install --check-files
COPY . /myapp

## Add Endpoint
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000
