var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  bearer_token: process.env.BEARER_TOKEN,
});

var re = /#[a-zA-Z0-9_]+/g;

exports.handler = (event, context, callback) => {
  client.get('search/tweets', {q: JSON.parse(event.body).hashtag, 'count': 100}, function(error, tweets, response) {

    var tweetTags = tweets.statuses.map(function(item){
      return item.text.match(re);
    }).filter(function(item){
      return item !== null;
    });
    var result = {};
    tweetTags.forEach(function(items){
      items.forEach(function(item){
        if(result[item.toLowerCase()] === undefined){
          result[item.toLowerCase()] = 0;
        }
        result[item.toLowerCase()] += 1;
    });
    });

    var output = {"statusCode": 200,
    "headers": {"Content-Type": "application/json"},
    "body": JSON.stringify(result)};
    callback(null, output);
    });
};
