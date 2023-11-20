# Steve's BEnd Northcoders News Project

The first step in order to clone this and run it locally will be to recreate the two .env files which are not shared via the repo.
The files should be created (using new file) and renamed as
.env.test  
.env.development

Each must have a single line entered, and saved, in the style of the .env-example.

.env.test should contain; PGDATABASE=nc_news_test
.env.development should contain; PGDATABASE=nc_news_test

For security, confirm that these files are in the gitignore. The wildcard opperator is used to ignore all .env files on line 2 of the git ignore; .env.\*
