(function() {

  angular
    .module('app.profile')
	.controller('ProfileController', ProfileController);

  function ProfileController($scope, $routeParams, $firebaseArray, $location, navBarService, $firebaseObject, $q) {
    console.log("ProfileController");
    $scope.list =[];
    
    var ref = firebase.database().ref();
    var user = firebase.auth().currentUser;

    var profileRef = $firebaseObject(ref.child("/auth/usedLinks/"+$routeParams.displayName));
    profileRef.$loaded().then(function(){
        var profile = $firebaseObject(ref.child('/auth/users/'+profileRef.$value));
        profile.$loaded().then(function (){
            $scope.displayName = profile.displayName;
            getUserAchievements(profile.$id).then(function(results) {
                $scope.achievelist = results;
            });
            if(user && profile.$id == user.uid) {
                $scope.displayPencil = true;
            }else {
                $scope.displayPencil = false;
            }
            $scope.displayPic = profile.pic;
        });
    });
    
    

    function getUserAchievements(uid) {
        var deferred = $q.defer();
        var achievedlist = [];
        var achievements = [];
        var achievementsNum = 0;
        var courseList = [];
        var courseSequence = $firebaseObject(ref.child('/courseSequence/'));
        courseSequence.$loaded().then(function (){
            courseSequence.forEach(function(childSnapshot) {
                courseList.push(childSnapshot);
            });
            var courseProgressRef = ref.child('/userProfiles/' + uid + '/courseProgress/');
            courseProgressRef.once('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key;
                achievedlist.push(key);
              });
              var totalCourse = courseList.length;
              for (i = 0; i < totalCourse; i++) { 
                var chapter = courseList[i];
                if(chapter.qns) {
                    var qnsCount = chapter.qns.length;
                    var currentPos = 0;
                    for (j = 0; j < qnsCount; j++) { 
                        if(chapter.qns[j]) {
                            if(achievedlist.indexOf(chapter.qns[j].qid) == -1){
                                chapter.qns.splice(currentPos, 1);
                            } else {
                                achievementsNum++;
                                currentPos++;
                            }
                        } else {
                            chapter.qns.splice(currentPos, 1);
                        }
                    }
                    if(chapter.qns.length > 0) {
                        achievements.push(chapter);
                    }
                }
              }
              $scope.numAchievement = achievementsNum;
              deferred.resolve(achievements);
            })
        });
        return deferred.promise;
    }
  }

})();