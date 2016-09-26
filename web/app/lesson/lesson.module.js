(function() {

  angular
    .module('app.lesson', [])
    .config(configFunction);
  
  function configFunction($routeProvider) {
    $routeProvider.
	when('/lesson/mcq/:chapter/:qns/:qid', {
      templateUrl: 'app/lesson/mcq.html',
	  controller: 'LessonController'
    }).
	when('/lesson/slides/:chapter/:qns/:qid', {
      templateUrl: 'app/lesson/slides.html',
	  controller: 'LessonController'
    }).
	when('/lesson/video/:chapter/:qns/:qid', {
      templateUrl: 'app/lesson/video.html',
	  controller: 'LessonController'
    }).
	when('/lesson/excel/:chapter/:qns/:qid', {
      templateUrl: 'app/lesson/excel.html',
	  controller: 'LessonController'
    }).
  when('/lesson/code/:chapter/:qns/:qid', {
      templateUrl: 'app/lesson/codebox.html',
    controller: 'LessonController'
    });
  }
  
})();