/* eslint-disable no-unused-vars */

let nextPageToken = ''; // Global variable to store the next page token

async function searchVideo() {
  const videoLink = document.getElementById('videoLink').value;
  const videoId = extractVideoId(videoLink);

  if (videoId) {
    try {
      const commentsData = await fetchComments(videoId);
      const { comments, positiveCount, negativeCount } = categorizeComments(commentsData);
      displayComments(comments, positiveCount, negativeCount);
      displayPieChart(positiveCount, negativeCount);
    } catch (error) {
      alert('Error fetching comments');
    }
  } else {
    alert('Invalid YouTube video link');
  }
}

// Function to extract video ID from YouTube video link
function extractVideoId(videoLink) {
  const match = videoLink.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
  return match ? match[1] : null;
}

// Function to fetch comments from YouTube using YouTube Data API
async function fetchComments(videoId) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyBQrTiqQvHfrbJcAYXB845pnqYtyD-cKsE&videoId=${videoId}&maxResults=20&pageToken=${nextPageToken}&part=snippet`);
  const data = await response.json();

  if (data.items) {
    nextPageToken = data.nextPageToken || ''; // Update next page token for pagination
    return data.items.map(item => item.snippet.topLevelComment.snippet.textOriginal);
  } else {
    throw new Error('Error fetching comments');
  }
}

// Function to categorize comments based on sentiment
function categorizeComments(comments) {
  let positiveCount = 0;
  let negativeCount = 0;
  const categorizedComments = comments.map(comment => {
    if (hasPositiveSentiment(comment)) {
      positiveCount++;
      return { text: comment, sentiment: 'Positive' };
    } else if (hasNegativeSentiment(comment)) {
      negativeCount++;
      return { text: comment, sentiment: 'Negative' };
    } else {
      return { text: comment, sentiment: 'Neutral' };
    }
  });
  return { comments: categorizedComments, positiveCount, negativeCount };
}

// Function to check if a comment has positive sentiment
function hasPositiveSentiment(comment) {
  const positiveWords = ['good', 'great', 'awesome', 'excellent']; // Add more positive words as needed
  return positiveWords.some(word => comment.toLowerCase().includes(word));
}

// Function to check if a comment has negative sentiment
function hasNegativeSentiment(comment) {
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible']; // Add more negative words as needed
  return negativeWords.some(word => comment.toLowerCase().includes(word));
}

// Function to display comments and counts in the UI
function displayComments(comments, positiveCount, negativeCount) {
  const commentsContainer = document.getElementById('commentsContainer');
  commentsContainer.innerHTML = `<h2>Comments</h2>
                                  <p>Total Comments: ${comments.length}</p>
                                  <p>Positive Comments: ${positiveCount}</p>
                                  <p>Negative Comments: ${negativeCount}</p>`;

  comments.forEach(comment => {
    let commentClass = 'neutral'; // Default class for neutral comments
    if (comment.sentiment === 'Positive') {
      commentClass = 'positive';
    } else if (comment.sentiment === 'Negative') {
      commentClass = 'negative';
    }
    commentsContainer.innerHTML += `<p class="${commentClass}"><strong>${comment.sentiment}:</strong> ${comment.text}</p>`;
  });
}

// Function to display pie chart of sentiment distribution
function displayPieChart(positiveCount, negativeCount) {
  const ctx = document.createElement('canvas');
  ctx.id = 'sentimentPieChart';
  ctx.width = 200;
  ctx.height = 200;
  document.getElementById('commentsContainer').appendChild(ctx);

  // eslint-disable-next-line no-undef
  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Positive', 'Negative'],
      datasets: [{
        data: [positiveCount, negativeCount],
        backgroundColor: ['#36a2eb', '#ff6384']
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Sentiment Distribution'
      },
      animation: {
        animateRotate: true, // Enable rotation animation
        animateScale: true // Enable scaling animation
      }
    }
  });
}
