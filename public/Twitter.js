// Function to fetch tweets of a user
async function fetchTweets(userId) {
    const apiKey = 'tGMljdH3A2ze2TsbH7gMDxhWX'; // Replace with your actual Twitter API key
    const endpoint = `https://api.twitter.com/2/users/by/username/${userId}?user.fields=id`;
    
    try {
        // Fetch user ID using the username
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user ID');
        }
        
        const userData = await response.json();
        const userId = userData.data.id;
        
        // Fetch recent tweets of the user
        const tweetsEndpoint = `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=created_at`;
        const tweetsResponse = await fetch(tweetsEndpoint, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        if (!tweetsResponse.ok) {
            throw new Error('Failed to fetch tweets');
        }
        
        const tweetsData = await tweetsResponse.json();
        const tweets = tweetsData.data;
        
        return tweets;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Function to analyze sentiment of a tweet
function analyzeSentiment(tweet) {
    // Replace this with your own sentiment analysis logic
    // For demonstration, let's assume it's always neutral
    return 'neutral';
}

// Function to categorize tweets into positive, negative, and neutral
function categorizeTweets(tweets) {
    let positiveTweets = [];
    let negativeTweets = [];
    let neutralTweets = [];
    
    tweets.forEach(tweet => {
        const sentiment = analyzeSentiment(tweet);
        if (sentiment === 'positive') {
            positiveTweets.push(tweet);
        } else if (sentiment === 'negative') {
            negativeTweets.push(tweet);
        } else {
            neutralTweets.push(tweet);
        }
    });
    
    return {
        positive: positiveTweets,
        negative: negativeTweets,
        neutral: neutralTweets
    };
}

// Function to display tweets
function displayTweets(tweets) {
    const tweetCount = tweets.length;
    console.log('Total tweets:', tweetCount);
    
    const categorizedTweets = categorizeTweets(tweets);
    console.log('Positive tweets:', categorizedTweets.positive);
    console.log('Negative tweets:', categorizedTweets.negative);
    console.log('Neutral tweets:', categorizedTweets.neutral);
}

// Example usage
const userId = '@SamMend16282884'; // Replace with the Twitter handle of the user
fetchTweets(userId)
    .then(tweets => {
        displayTweets(tweets);
    })
    .catch(error => {
        console.error('Error:', error);
    });
