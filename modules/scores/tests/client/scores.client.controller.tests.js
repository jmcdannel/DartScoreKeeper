'use strict';

(function () {
  // Scores Controller Spec
  describe('Scores Controller Tests', function () {
    // Initialize global variables
    var ScoresController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Scores,
      mockScore;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Scores_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Scores = _Scores_;

      // create mock score
      mockScore = new Scores({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Score about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Scores controller.
      ScoresController = $controller('ScoresController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one score object fetched from XHR', inject(function (Scores) {
      // Create a sample scores array that includes the new score
      var sampleScores = [mockScore];

      // Set GET response
      $httpBackend.expectGET('api/scores').respond(sampleScores);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.scores).toEqualData(sampleScores);
    }));

    it('$scope.findOne() should create an array with one score object fetched from XHR using a scoreId URL parameter', inject(function (Scores) {
      // Set the URL parameter
      $stateParams.scoreId = mockScore._id;

      // Set GET response
      $httpBackend.expectGET(/api\/scores\/([0-9a-fA-F]{24})$/).respond(mockScore);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.score).toEqualData(mockScore);
    }));

    describe('$scope.craete()', function () {
      var sampleScorePostData;

      beforeEach(function () {
        // Create a sample score object
        sampleScorePostData = new Scores({
          title: 'An Score about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Score about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Scores) {
        // Set POST response
        $httpBackend.expectPOST('api/scores', sampleScorePostData).respond(mockScore);

        // Run controller functionality
        scope.create();
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the score was created
        expect($location.path.calls.mostRecent().args[0]).toBe('scores/' + mockScore._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/scores', sampleScorePostData).respond(400, {
          message: errorMessage
        });

        scope.create();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock score in scope
        scope.score = mockScore;
      });

      it('should update a valid score', inject(function (Scores) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/scores\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update();
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/scores/' + mockScore._id);
      }));

      it('should set scope.error to error response message', inject(function (Scores) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/scores\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update();
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(score)', function () {
      beforeEach(function () {
        // Create new scores array and include the score
        scope.scores = [mockScore, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/scores\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockScore);
      });

      it('should send a DELETE request with a valid scoreId and remove the score from the scope', inject(function (Scores) {
        expect(scope.scores.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.score = mockScore;

        $httpBackend.expectDELETE(/api\/scores\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to scores', function () {
        expect($location.path).toHaveBeenCalledWith('scores');
      });
    });
  });
}());
