//let whichTweets = 0; 

// main UI for the feed, was make using bootstrap

function tweetView() {
    return $(`
    <div id="wrapper">
        <nav class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
            <div class="container-fluid d-flex flex-column p-0">
                <a class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0" href="index.html">
                    <div class="sidebar-brand-icon rotate-n-15"><i class="fab fa-twitter"></i></div>
                    <div class="sidebar-brand-text mx-3"><span>Twitter 2.0</span></div>
                </a>
                <hr class="sidebar-divider my-0">
                <ul class="nav navbar-nav text-light" id="accordionSidebar">
                    <li class="nav-item" role="presentation"><a class="nav-link active" href="index.html"><i
                                class="icon ion-ios-time"></i><span>Home</span></a></li>
                </ul>
            </div>
        </nav>
        <div class="d-flex flex-column" id="content-wrapper"><br>
            <div id="content">
                <div class="container-fluid">
                    <div class="d-sm-flex justify-content-between align-items-center mb-4">
                        <h3 class="text-dark mb-0">News Feed</h3><a
                            class="sendRefresh btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="#"
                            style="margin-left: 600px;">Refresh Page</a><a
                            class="makeNewPostButton btn btn-primary btn-sm d-none d-sm-inline-block" role="button" href="">New Post</a>
                    </div>
                </div>
            </div>
            <section id="baseUI">
            <div id="tweetFeed">
        <div>
        </section></div>`);
}

async function loadFeed(skipNum) {

    const tweets = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        // params: {
        //     skip: skipNum,
        // }
    });

    for (let i = 0; i < 50; i++) {
        let tweet = tweets.data[i];
        $('#tweetFeed').append(tweetWidget(tweet));
    }
}

export const tweetWidget = function (tweet) {

    const baseTweet = $(`<div class="baseTweet" id="${tweet.id}"></div>`);

    baseTweet.append(tweetArea(tweet));
    return baseTweet;
}

export const tweetArea = function (tweet) {
    const timePosted = new Date(tweet.updatedAt).toLocaleTimeString("en-US") + "   " + new Date(tweet.updatedAt).toLocaleDateString("en-US");
    let tweetCard = $(`<div tweetId="${tweet.id}" style="background-color: #D4D2D5;">`);
    tweetCard.append($(`<div class="col"></div>`));
    tweetCard.append($(`<div class="card">`));
    tweetCard.append($(`<div class="card-body" tweetId="${tweet.id}"><h5 class="card-title">${tweet.body}</h5></div>`));
    tweetCard.append($(`<ul class="list-group list-group-flush" style="background-color: #DDDDDD;">`));
    tweetCard.append($(`<li class="list-group-item" style="background-color: #DDDDDD;">${tweet.author}</li>`));
    tweetCard.append($(`<li class="list-group-item" timePosted" style="background-color: #DDDDDD;">${timePosted}</li>`));
    tweetCard.append($(`</ul>`)); 
    tweetCard.append($(`<br>`));

    // determine whether the tweet is mine or not, and accordingly add the right buttons/functionality
    if (tweet.isMine) {
        tweetCard.append($(`<button class="deleteButton btn btn-primary" style="margin-left: 15px; margin-right: 15px;">Delete</button>`));
        tweetCard.append($(`<button class="editButton btn btn-primary" style="margin-left: 15px; margin-right: 15px;">Edit</button>`));
        tweetCard.append($(`<button class="btn btn-light" style="margin-left: 15px; margin-right: 15px;">Likes: ${tweet.likeCount}</button>`));
        tweetCard.append($(`<button class="btn btn-light" style="margin-left: 15px; margin-right: 15px;">Retweets: ${tweet.retweetCount}</button>`));
        tweetCard.append($(`<button class="btn btn-light" style="margin-left: 15px; margin-right: 15px;">Replies: ${tweet.replyCount}</button>`));
        
    } else {
        if (tweet.isLiked) {
            tweetCard.append($(`
                <button class="unlikeButton btn btn-danger" type="submit" style="margin-left: 15px; margin-right: 15px;">${tweet.likeCount} Like</button>`));
        } else {
            tweetCard.append($(`
                <button class="likeButton btn btn-light" type="submit" style="margin-left: 15px; margin-right: 15px;">${tweet.likeCount} Likes</button>`));
        }

        tweetCard.append($(`<button class="retweetButton btn btn-primary" style="margin-right: 15px;">${tweet.retweetCount} Retweets</button>`));
        tweetCard.append($(`<button class="replyButton btn btn-primary" style="margin-right: 15px;">${tweet.replyCount} Replies</button>`));
    }

    tweetCard.append($(`<hr>`));
    return tweetCard;
}

export const handleLikeButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');

    const result = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/like',
        withCredentials: true,
    });

    reloadFeed();
    return result;
}

export const handleUnlikeButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');

    const result = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id + '/unlike',
        withCredentials: true,
    });

    reloadFeed();
    return result;
}

export const handleRetweetButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');
    const baseTweet = $('#' + id);
    baseTweet.empty();

    let parent = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    baseTweet.append(createRetweetBox(id));
    return parent; 
}

export const createRetweetBox = function (id) {

    return $(`
        <div class="card retweetForm">
            <form>
            <h5 class="card-header">Retweet</h5>
            <div class="card-body">
                <h5 class="card-title">What are you thinking about this?</h5>
                
                    <div class="">Retweet</div>
                    <br>
                        <textarea rows="3" cols="50" id="retweetInfo" placeholder="What do you want to say about this tweet?"></textarea>              
                <button class="btn btn-primary" id="sendRT" tweetId="${id}" type="submit">Save</button>
                <button class="btn btn-primary" id="cancel">Cancel</button>
            </div>
            </form>
        </div>
    `);
}

export async function handleReplyButtonPress() {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');
    const baseTweet = $('#' + id);
    baseTweet.empty();

    let parent = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    baseTweet.append(createReplyBox(id));
    return parent
}

export const createReplyBox = function (id) {

    return $(`
        <div class="card replyForm">
        <form>
        <h5 class="card-header">Reply</h5>
        <div class="card-body">
            <h5 class="card-title">Add to the conversation!</h5>
            
                <div class="">Reply</div>
                <br>
                    <textarea rows="3" cols="50" id="replyInfo" placeholder="What do you want to reply with?"></textarea>              
            <button class="btn btn-primary" id="sendReply" tweetId="${id}" type="submit">Send</button>
            <button class="btn btn-primary" id="cancel">Cancel</button>
        </div>
        </form>
        </div>
    `);
}

export const handleEditButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');
    const baseTweet = $('#' + id);
    baseTweet.empty();

    const tweet = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    baseTweet.append(createEditBox(tweet.data));
    return tweet;
}

export const createEditBox = function (tweet) {
    return $(`
        <div class="editBox card">
            <div>${tweet.author}</div>
            <form>
            <h5 class="card-header">Edit Post</h5>
            <div class="card-body">
                <h5 class="card-title">Edit your post</h5>
                    <br>
                    <textarea rows="3" cols="50" id="editUpdate">${tweet.body}</textarea>              
                    <button class="btn btn-primary" id="sendEdit" tweetId="${tweet.id}" type="submit">Save</button>
                    <button class="btn btn-primary" id="cancel">Cancel</button>
            </div>
            </form>
        </div>
        </div>
    `);
}

export const handleEditSubmitButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute('tweetId');
    const bodyUpdated = $('#editUpdate').val();

    const update = await axios({
        method: 'put',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
        data: {
            "body": bodyUpdated,
        },
    });

    reloadFeed();
    return update;
}

export const handleRetweetSubmitButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute('tweetId');
    let retweetBody;

    let parent = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    if ($("#retweetInfo").val().length == 0) {
        retweetBody = "Retweeted from @" + parent.data.author + ": " + parent.data.body;
    } else {
        retweetBody = $("#retweetInfo").val() + "<hr> Retweeted from @" + parent.data.author + " : " + parent.data.body;
    }

    let update = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "retweet",
            "parent": id,
            "body": retweetBody, 
        },
    });

    reloadFeed();
    return update;
}

export const handleReplySubmitButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute('tweetId');
    let replyBody;

    let parent = await axios({
        method: 'get',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    if ($("#replyInfo").val().length == 0) {
        replyBody = "A reply to @" + parent.data.author + ": " + parent.data.body;
    } else {
        replyBody = $("#replyInfo").val() + "<hr> A reply to @" + parent.data.author + " : " + parent.data.body;
    }

    let reply = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            "type": "reply",
            "parent": id,
            "body": replyBody
        },
    });

    reloadFeed();
    return reply;

}

export const handleDeleteButtonPress = async function (event) {
    event.preventDefault();
    const id = event.target.parentNode.getAttribute('tweetId');

    const deleteTweet = await axios({
        method: 'delete',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets/' + id,
        withCredentials: true,
    });

    reloadFeed();
    return deleteTweet;
}

export const handleNewPostButtonPress = function (event) {
    event.preventDefault();
    const tweetFeed = $('#tweetFeed');
    tweetFeed.empty();
    tweetFeed.append(createTweetPostBox());
}

export const createTweetPostBox = function () {
    return $(`
        <div class="baseTweet">
            <div class="col">
                <div class="card">
                <div class="card-body">New Post
                <br>
                <form>
                    <textarea rows="3" cols="50" id="userPost" placeholder="What's on your mind?"></textarea>              
                    <footer>
                            <button class="btn btn-primary" id="sendSubmit" type="submit">Send</button>
                            <button class="btn btn-primary" id="cancel">Cancel</button>
                    </footer>
                </form>
            </div>
        </div>
    `);
}

export const handlePostSubmitButtonPress = async function (event) {
    event.preventDefault();
    const body = $('#userPost').val();

    const result = await axios({
        method: 'post',
        url: 'https://comp426fa19.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: body,
        }
    });

    reloadFeed();
}

export const handleRefreshFeedButtonPress = function (event) {
    event.preventDefault();
    reloadFeed();
}

function reloadFeed() {
    let tweetFeed = $('#tweetFeed');

    tweetFeed.empty();
    loadFeed();
}

function makePage() {
    let body = $('body');

    body.empty();
    body.append(tweetView());

    loadFeed();

    body.on('click', '.likeButton', handleLikeButtonPress);
    body.on('click', '.unlikeButton', handleUnlikeButtonPress);
    body.on('click', '.editButton', handleEditButtonPress);
    body.on('click', '.retweetButton', handleRetweetButtonPress);
    body.on('click', '.deleteButton', handleDeleteButtonPress);
    body.on('click', '.makeNewPostButton', handleNewPostButtonPress);
    body.on('click', ".replyButton", handleReplyButtonPress);
    body.on('click', '.sendRefresh', handleRefreshFeedButtonPress);
    body.on('click', '#sendEdit', handleEditSubmitButtonPress);
    body.on('click', '#sendRT', handleRetweetSubmitButtonPress);
    body.on('click', '#sendReply', handleReplySubmitButtonPress);
    body.on('click', '#sendSubmit', handlePostSubmitButtonPress);
    
}

$(document).ready(makePage());

// $(document).ready(() => {
//     $(window).scroll(function(){
//         if($(document).height() == $(window).scrollTop() + $(window).height()){
//             loadFeed(whichTweets);
//             whichTweets += 25;
//         }
//     });
//     makePage();
//     whichTweets += 25;
// });