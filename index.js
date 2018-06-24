'use strict'

const axios = require('axios')
const twitter = require('./twitter')

let filteringWord = ['github', 'install', 'use', 'using', 'test', 'shell', 'terminal', 'command', 'cmd', 'cli']

// get top 10 most popular repos for Football
async function getRepos (keywords, sort) {
    try {
        const gh = `https://api.github.com/search/repositories?q=${keywords}&sort=${sort}&order=desc`
        const response = await axios.get(gh)
        const repos = response.data.items //.slice(0, 10)
        return repos
    } catch (error) {
        console.error(error)
    }
}

// search twitter for keyword and respond with first 10 tweets
async function searchTwitter (keywords, searchTwitter) {
    try {
        // console.log(twitter)
        const tweet = await twitter.get('search/tweets', { q: keywords })
        
        let tweets = tweet.statuses

        keywords = keywords.split(' OR ')[0]
        keywords = keywords.split('/')
        // console.log(keywords)

        let filteredTweets = []
        for (var i = 0; i < tweets.length; i++) {
            // console.log(tweets[i].text)
            let tweetText = tweets[i].text.toLowerCase()
            let contains = false
            for (var j = 0; j < filteringWord.length; j++) {
                if(tweetText.indexOf(filteringWord[j]) > -1) {
                    contains = true
                }
            }
            
            let condFromText = (tweetText.indexOf(keywords[1].toLowerCase()) > -1) && ((tweetText.indexOf(keywords[0].toLowerCase()) > -1) || contains)
            
            let condFromUrl = false
            if(tweets[i].entities.length > 0 && tweets[i].entities.urls.length > 0 ) {
                for (var k = 0; k < tweets[i].entities.urls.length; k++) {
                    if(tweets[i].entities.urls[k].url.indexOf('github') > -1 || tweets[i].entities.urls[k].expanded_url.indexOf('github') > -1) {
                        condFromUrl = true
                    }
                }
            }

            if(condFromText || condFromUrl) {
                filteredTweets.push(tweets[i])
            }
        }

        if(filteredTweets.length > 0) {
            filteredTweets.sort(function(a, b){
                return b.retweet_count - a.retweet_count
            });
        }

        return filteredTweets//.statuses.splice(0, 10)
    } catch (error) {
        console.error(error)
    }
}

let main = async () => {

    let result = []

    let argSearchKey = 'Football'
    let argSortKey = 'stars'
   
    // console.log(process.argv)

    if(process.argv.length > 2) {
        argSearchKey = process.argv[2]
    }

    if(process.argv.length > 3) {
        argSortKey = process.argv[3]
    }

    // Get repo response
    const repos = await getRepos(argSearchKey, argSortKey)
    // console.log(repos)

    for (let i = 0; i < repos.length; i++) {
        // Get tweets for related github repo using the name and fullname of repo
        let tweets = await searchTwitter(repos[i].full_name  + ' OR ' + repos[i].name)
        
        result.push({
            git: {
                name: repos[i].name,
                full_name: repos[i].full_name,
                html_url: repos[i].html_url,
                description: repos[i].description,
                owner: repos[i].owner,
                forks: repos[i].forks,
                score: repos[i].score
            },
            tweets: tweets
        })
    }

    // Log the result
    console.log(result)
}

main()