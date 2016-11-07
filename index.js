var moment = require('moment');
var assert = require('assert');
var unirest = require('unirest');

var auth = {
	token: "",
	key: ""
};

function determineTrialDates(customer){
	assert(customer, 'chartmogul customer object required');

	return new Promise(function (resolve, reject){
		var start = moment(customer['customer-since']);
		if (!start){ reject(customer); return; }

		var free_trial_started_at = start.subtract(1, 'week').format("YYYY-MM-DD");
		var lead_created_at = start.subtract((Math.floor(Math.random() * 3) + 2), 'week').format("YYYY-MM-DD");

		var dates = {
			lead_created_at,
			free_trial_started_at
		};

		resolve({ dates, uuid: customer.uuid });
	});
}

function setTrialData(data) {
	assert(data.dates, 'trial dates required');
	assert(data.uuid, 'chartmogul customer uuid required');

	return new Promise(function (resolve, reject){
		unirest.patch('https://api.chartmogul.com/v1/customers/'+data.uuid)
		.auth(auth.token, auth.key)
		.send(JSON.stringify(data.dates))
		.headers({'Content-Type': 'application/json'})
		.end(function (response) {
			if (response.body){
				console.log("Added trial data to %s", response.body.uuid)
				resolve(response.body);
			} else {
				reject(response.status);
			}
		});
	});
}

function getAllCustomers(){
	return new Promise(function(resolve, reject) {

		var customers = [];

		function getCustomers(page){
			unirest.get('https://api.chartmogul.com/v1/customers/?page='+page)
			.auth(auth.token, auth.key)
			.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
			.end(function (response) {
				customers = customers.concat(response.body.entries);
				console.log("Retrieved page %s of customers. %s retrieved in total.", response.body.page, customers.length);

				if (response.body.has_more){
					getCustomers(response.body.page+1)
				} else {
					console.log("Retrieved all %s customers", customers.length);
					resolve(customers);
				}
			});
		}

		getCustomers(1);

	});
}

function addTrialDataToAllCustomers(customers){
	var ratelimit = 100;

		customers.forEach(function(customer){
			setTimeout(function(){
				ratelimit+=100;
				determineTrialDates(customer).then(setTrialData).catch(console.log);
			}, ratelimit);
		})
}

getAllCustomers()
.then(addTrialDataToAllCustomers)
.catch(console.log);
