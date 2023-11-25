# Steve's BEnd Northcoders News Project
# Northcoders News API Back End Project - introduction.
This API is the back end project which is intended to work with the front end project to collectively produce a complete and functioning whole. It is designed to allow access to data programmatically.
The back end project is built using javascript with express to access a PSQL database. Testing through Jest and Supertest has been used for Test Driven Development throughout, and Github has been used in a style to mimic a real world development work flow; working, tested code for one ticket is used for a PR on its own branch while work continues in another branch. Feedback from mentors mimics the process in industry, and a review will lead to either changes or merging of the branch.

The live version is hosted through the render service on this link; https://steves-nc-news-project.onrender.com

# In order to make a local copy of the API.
1. The first step is to clone the public repo from https://github.com/BigDaddyTarpon/Steve-s-BEend-NC-News-project

2. Run npm i through the terminal to install dependencies. All dependencies used can be viewed in the package.json.

3. In order to run this locally you will be required to recreate the two .env files which are not shared via the repo to mimic industry standards.
The files should be created (using new file) and renamed as
.env.test  
.env.development

Each must have a single line entered, and saved, in the style of the .env-example.

.env.test should contain; PGDATABASE=nc_news_test
.env.development should contain; PGDATABASE=nc_news_test

It is possible to confirm that these files are in the gitignore. The wildcard opperator is used on line 2 of the gitignore file to ignore all the .env files.

4. Running the tests with the cmmand 'npm test intergtation' will reseed the test data with each test. However it is also possible to seed the development data base by running the seed file provided; npm run seed (for development data). The live version will not need to be seeded.
