var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

var A_TOKEN = "3518347609.988e802.516954288470424a85de430677bccc48";

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
  $scope.hasToken = true;
  var token = window.location.hash;
  if (!token) {
    $scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
	  var path = "/users/self/media/recent";
	  var mediaUrl = INSTA_API_BASE_URL + path;

	  $http({
	    method: "JSONP",
	    url: "https://api.instagram.com/v1/users/self/media/recent/?access_token=ACCESS-TOKEN",
	    params: {
	    	callback: "JSON_CALLBACK",
	    	access_token: A_TOKEN
	    }
	  }).then(function(response) {
      	$scope.picArray = response.data.data;
      	console.log($scope.picArray);

      	/* Basic User Information */
      	if ($scope.picArray.length >= 1) {
      		$scope.fullName = $scope.picArray[0].user.full_name;
      		$scope.username = $scope.picArray[0].user.username;
      		$scope.profilePicture = $scope.picArray[0].user.profile_picture;
      	}

      	/* Calculate Ego Score */
      	var totalEgo = 0;
      	for (var i = 0; i < $scope.picArray.length; i++) {
      		if ($scope.picArray[i].user_has_liked) {
      			totalEgo++;
      		}
      	}
      	var temp = (totalEgo / $scope.picArray.length) * 100;
      	$scope.egoScore = temp + "%";

      	/* Calculate Popularity */
      	var totalLikes = 0;
      	for (var i = 0; i < $scope.picArray.length; i++) {
      		totalLikes += parseInt($scope.picArray[i].likes.count);
      	}
      	$scope.popularity = totalLikes / $scope.picArray.length;

      	/* Calculate Active Days */
      	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      	var dayCount = [0,0,0,0,0,0,0]; // Keep track of number of times posted on day
      	for (var i = 0; i < $scope.picArray.length; i++) {
      		var timestamp = $scope.picArray[i].created_time;
      		var d = new Date(timestamp * 1000); // Convert from Unix timestamp to day of the week
      		var dayOfWeek = days[d.getDay()];

      		/* Update count of days on which pictures were uploaded */
      		if (dayOfWeek === "Sunday") {
      			dayCount[0]++;
      		} else if (dayOfWeek === "Monday") {
      			dayCount[1]++;
      		} else if (dayOfWeek === "Tuesday") {
      			dayCount[2]++;
      		} else if (dayOfWeek === "Wednesday") {
      			dayCount[3]++;
      		} else if (dayOfWeek === "Thursday") {
      			dayCount[4]++;
      		} else if (dayOfWeek === "Friday") {
      			dayCount[5]++;
      		} else if (dayOfWeek === "Saturday") {
      			dayCount[6]++;
      		}
      	}

      	/* Loop through to find day with maximum postings */
      	var max = 0;
      	for (var i = 0; i < dayCount.length; i++) {
      		if (max <= dayCount[i]) {
      			max = dayCount[i];
      		}
      	}

      	/* Push max days to a max day array then return array */
      	var maxDays = [];
      	for (var i = 0; i < dayCount.length; i++) {
      		if (dayCount[i] === max) {
      			maxDays.push(days[i]);
      		}
      	}
      	$scope.activeDays = maxDays.join(", ");

      	/* Calculate Brevity */
      	var totalLength = 0;
      	for (var i = 0; i < $scope.picArray.length; i++) {
      		totalLength += parseInt($scope.picArray[i].caption.text.length);
      	}
      	$scope.brevity = totalLength / $scope.picArray.length;

      	/* Calculate Visibility Thirst */
      	var totalTags = 0;
      	for (var i = 0; i < $scope.picArray.length; i++) {
      		totalTags += parseInt($scope.picArray[i].tags.length);
      	}
      	$scope.visibilityThirst = totalTags / $scope.picArray.length;
	  })
	};

	var analyzeSentiments = function() {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
	}
});
