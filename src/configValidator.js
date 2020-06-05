// TODO: Remove this eslint issue
/* eslint-disable no-unused-vars */

const defaultConfig = require('./configs/defaultConfig');
const { REQUEST_TYPES } = require('./utils/apiHelper');

const configValidator = config => {
  if (!config) {
    return defaultConfig;
  }

  // Assigning isDefault false to indicate the custom config
  config.isDefault = false;

  config.apiPath = config.apiPath || defaultConfig.apiPath;
  config.consumedServicesAsyncMode = config.consumedServicesAsyncMode || defaultConfig.consumedServicesAsyncMode;
  
  // Validate responses
  if (config.response) {
    const { statusCodes } = config.response;
    if (typeof statusCodes !== "boolean") {
      config.response.statusCodes = defaultConfig.response.statusCodes;
    }
  } else {
    config.response = defaultConfig.response;
  }

  // validate consumed services
  if (config.consumedServices) {
    const defaultServiceConfig = defaultConfig.consumedServices.defaultServiceId;
    for (let [serviceId, serviceConfig] of Object.entries(config.consumedServices)) {
      if (serviceConfig) {
        serviceConfig.isValid = true;
        serviceConfig.serviceName =  serviceConfig.serviceName || defaultServiceConfig.serviceName;
        if (!serviceConfig.healthCheckUrl) {
          serviceConfig.isValid = false;
        }

        if (!serviceConfig.requestMethod) {
          serviceConfig.requestMethod = defaultServiceConfig.requestMethod;
        }
        serviceConfig.requestMethod = serviceConfig.requestMethod.toUpperCase();
        if (!REQUEST_TYPES[serviceConfig.requestMethod]) {
          serviceConfig.isValid = false;
        }

        if (!serviceConfig.expectedResponseStatus) {
          serviceConfig.expectedResponseStatus = defaultServiceConfig.expectedResponseStatus;
        }
        // TODO: Check expectedResponseStatus for valid integer

        if (!serviceConfig.isRequired || typeof serviceConfig.isRequired !== "boolean") {
          serviceConfig.isRequired = defaultServiceConfig.isRequired;
        }
      }
    }
  } else {
    config.consumedServices = {};
  }

  // validate apis
  if (config.apis) {
    const defaultApiConfig = defaultConfig.apis.defaultApi;
    for (let [apiId, apiConfig] of Object.entries(config.apis)) {
      apiConfig.apiName = apiConfig.apiName || defaultApiConfig.apiName;
      if (!apiConfig.requestMethod) {
        apiConfig.requestMethod = defaultApiConfig.requestMethod;
      }
     
      apiConfig.requestMethod = apiConfig.requestMethod.toUpperCase();
      if (!REQUEST_TYPES[apiConfig.requestMethod]) {
        apiConfig.requestMethod = defaultApiConfig.requestMethod;
      }
      if (!apiConfig.dependsOn || !Array.isArray(apiConfig.dependsOn)) {
        apiConfig.dependsOn = [];
      }

    }
  } else {
    config.apis = {};
  }
  return config;
};

module.exports = configValidator;
