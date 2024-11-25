// Define the AngularJS app
var app = angular.module("currencyConverterApp", []);

// Define the controller
app.controller("CurrencyController", function($scope, $http) {
    $scope.currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD"]; // Add more currencies if needed
    $scope.baseCurrency = "USD";
    $scope.targetCurrency = "EUR";
    $scope.amount = null;
    $scope.convertedAmount = null;

    // Function to convert currency
    $scope.convertCurrency = function() {
        if (!$scope.amount || !$scope.baseCurrency || !$scope.targetCurrency) {
            alert("Please enter all fields.");
            return;
        }

        const apiKey = "c98df37c78104d18848c1b46"; // Replace with your actual API key
        const apiUrl = `https://api.exchangerate-api.com/v4/latest/${$scope.baseCurrency}`;

        $http.get(apiUrl)
            .then(function(response) {
                const rates = response.data.rates;
                const rate = rates[$scope.targetCurrency];

                if (rate) {
                    $scope.convertedAmount = ($scope.amount * rate).toFixed(2);
                } else {
                    alert("Conversion rate not available for the selected currencies.");
                    $scope.convertedAmount = null;
                }
            })
            .catch(function(error) {
                console.error("Error fetching conversion rates:", error);
                alert("Failed to fetch currency conversion rates. Please try again.");
            });
    };
});
