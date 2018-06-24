# Getting started

1. Create a twitter application[https://apps.twitter.com/] and obtain `TWITTER_CONSUMER_KEY`, `TWITTER_CONSUMER_SECRET`, `TWITTER_ACCESS_TOKEN_KEY`, `TWITTER_ACCESS_TOKEN_SECRET`.

2. Create `.env` file with above obtained credentials, refer to `.env.example` for reference.

3. Run using `node index.js`

4. For advance search, pass search key and sort by values `node index.js <SearchKey> <SortBy>`. For example `node index.js Football pushed`
	. By default the search key is 'Football' as required by assignment/test and sort by value is 'stars' for github.

# Explanation

1. Program looks for the key search and sort value from the command line interface. If these values are available, the program uses the values otherwise it goes for the default values which is `Football` in case of search key and `stars` in case of sort by value.
2. This program first looks for the repositories from github using the command line arguments.
3. For each repository, program calls the twitter search api for the selected github repository using its name and full_name to search the tweets. 
	- `name` and `full_name` of repository is used to filtering and finding the tweets from twitter as only the name might get some tweets which are not related like in case of football search term, it will get all the related tweets other then the repo's related. 
	- `TWITTER_CONSUMER_KEY`, `TWITTER_CONSUMER_SECRET`, `TWITTER_ACCESS_TOKEN_KEY`, `TWITTER_ACCESS_TOKEN_SECRET` needs to be set as mentioned above in Getting Started section.
4. The filtering is applied on the tweets to find the nearly related tweets to the repository. For the filtering, following methods are used:
	- An array of string is compared with the tweet text.
	- The search keyword (full name of repo) is compared and search within the text of tweet.
	- URLs text is search for github word to make it sure that the tweet is related to repo.
The the over all result is then give us the final realted tweet.
5. The github repo (with some useful info) with related tweets are then stored in a seprate array and displayed after the search.

# Note

1. Twitter standard search API returns recent tweets published in last 7 days. If the tweets are available, the search will return the tweets with github repos.
2. The default value for the sorting from github is `stars` which gives us the most stared and famous repos. This can be changed by passing the word after the search key in command line interface.
