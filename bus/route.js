const axios = require('axios');
const { getAuthorizationHeader } = require('../util/common');
const baseUrl = 'https://tdx.transportdata.tw/api/basic/v2';
class Route {
	async getRoute(routeId) {
		try {
			return await axios({
				url: `${baseUrl}/Bus/Route/City/Taichung/?$filter=%20RouteID%20eq%20%27${routeId}%27&$format=json`,
				method: 'get',
				headers: await getAuthorizationHeader(),
			});
		} catch (error) {
			throw error;
		}
	}
	async getStop(routeId, direction) {
		try {
			return await axios({
				url: `${baseUrl}/Bus/StopOfRoute/City/Taichung/?$filter=%20RouteUID%20eq%20%27${routeId}%27%20and%20Direction%20eq%20%27${direction}%27&$format=json`,
				method: 'get',
				headers: await getAuthorizationHeader(),
			});
		} catch (error) {
			throw error;
		}
  }
  async getEstimateTime(routeId, direction, stopSequence) {
    try {
			return await axios({
				url: `${baseUrl}/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteUID%20eq%20%27${routeId}%27%20and%20Direction%20eq%20%27${direction}%27%20and%20StopSequence%20eq%20${stopSequence}&$format=json`,
				method: 'get',
				headers: await getAuthorizationHeader(),
			});
		} catch (error) {
			throw error;
		}
  }
  async getAllEstimateTimeByRouteId(routeId, direction) {
	try {
		return await axios({
			url: `${baseUrl}/Bus/EstimatedTimeOfArrival/Streaming/InterCity?$filter=SubRouteName%2FZh_tw%20eq%20'${routeId}'%20and%20Direction%20eq%20'${direction}'&$orderby=StopSequence,EstimateTime&$format=JSON`,
			method: 'get',
			headers: await getAuthorizationHeader(),
		});
	} catch (error) {
		throw error;
	}
	}

	async getAllEstimateTimeByRouteIdWithoutDirection(routeId) {
	try {
			return await axios({
				url: `${baseUrl}/Bus/EstimatedTimeOfArrival/Streaming/InterCity?$filter=SubRouteName%2FZh_tw%20eq%20'${routeId}'&$orderby=StopSequence&$format=JSON`,
				method: 'get',
				headers: await getAuthorizationHeader(),
			});
		} catch (error) {
			throw error;
		}
	}
	async getAllRoute() {
		try {
			return await axios({
				url: `${baseUrl}/Bus/Route/City/Taichung?$format=JSON`,
				method: 'get',
				headers: await getAuthorizationHeader(),
			});
		} catch (error) {
			throw error;
		}
	}
}
function createRoute() {
	return new Route();
}
module.exports = createRoute();