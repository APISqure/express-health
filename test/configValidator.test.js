const chai = require('chai');
const expect = chai.expect;
const configValidator = require('../src/configValidator');
const defaultConfig = require('../src/configs/defaultConfig');

let customConfig = {}

describe('should validate configurations through configValidator', () => {

    beforeEach(() => {
        customConfig = {
            isDefault: false,
            apiPath: '/test-status',
            mode: "ON_REQUEST",
            consumedServicesAsyncMode: true,
            consumedServices: {
                mockId: {
                    serviceName: 'mock service',
                    healthCheckUrl: '/',
                    requestMethod: 'GET',
                    expectedResponseStatus: '200',
                    isRequired: true
                }
            },
            apis: {}
          }
    })
    it('should return default config if custom config does not present', () => {
        const config = configValidator();
        expect(config).not.null;
        expect(config).to.haveOwnProperty("isDefault");
        expect(config.isDefault).is.true;
    });

    it('should not return default config if custom config is present', () => {
        expect(customConfig).not.null;
        const config = configValidator(customConfig);
        expect(config).not.null;
        expect(config).to.haveOwnProperty("isDefault");
        expect(config.isDefault).is.false;
    });

    it ('should set default path if custom config does not have path', () => {
        customConfig.apiPath = "";
        const config = configValidator(customConfig);
        expect(config.apiPath).is.not.empty;
        expect(config.apiPath).is.equal(defaultConfig.apiPath)
    });

    it ('should not set default path if custom config has a valid path', () => {
        expect(customConfig.apiPath).is.not.empty;
        const config = configValidator(customConfig);
        expect(config.apiPath).is.not.empty;
        expect(config.apiPath).is.equal(customConfig.apiPath)
    });

    it ('should set default mode if custom config does not have consumedServicesAsyncMode', () => {
        customConfig.consumedServicesAsyncMode = undefined;
        const config = configValidator(customConfig);
        expect(config.consumedServicesAsyncMode).is.not.undefined;
        expect(config.consumedServicesAsyncMode).is.equal(defaultConfig.consumedServicesAsyncMode)
    });

    it ('should not set default consumedServicesAsyncMode if custom config has a valid consumedServicesAsyncMode', () => {
        customConfig.consumedServicesAsyncMode = false;
        const config = configValidator(customConfig);
        expect(config.consumedServicesAsyncMode).is.not.undefined;
        expect(config.consumedServicesAsyncMode).is.equal(customConfig.consumedServicesAsyncMode)
    });

    describe("should validate response configurations", () => {
        it ('should set default response config if custom config does not have valid response config', () => {
            expect(customConfig.response).is.undefined;
            const config = configValidator(customConfig);
            expect(config.response).is.not.undefined;
            expect(config.response).is.equal(defaultConfig.response)
        });

        it ("should set response.statusCodes if custom config does not have", () => {
            customConfig.response = {}
            expect(customConfig.response.statusCodes).is.undefined;
            const config = configValidator(customConfig);
            expect(config.response.statusCodes).is.not.undefined;
            expect(config.response.statusCodes).is.equal(defaultConfig.response.statusCodes)
        })

        it ("should set valid response.statusCodes if custom config have a invalid property", () => {
            customConfig.response = { statusCodes: 'foo' }
            // TODO: Check this type of assert
            expect(typeof customConfig.response.statusCodes).is.not.equal("boolean")
            const config = configValidator(customConfig);
            expect(config.response.statusCodes).is.not.undefined;
            expect(typeof config.response.statusCodes).is.equal("boolean");
            expect(config.response.statusCodes).is.equal(defaultConfig.response.statusCodes)
        })
    })

    describe("should validate consumed services configurations", () => {
        it ('should set default config if custom config does not have valid consumedServices config', () => {
            customConfig.consumedServices = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices).is.not.undefined;
            expect(config.consumedServices).is.empty
        });

        it ('should not set default config if custom config has valid consumedServices config', () => {
            customConfig.consumedServices = { mockId: {}};
            const config = configValidator(customConfig);
            expect(config.consumedServices).is.not.empty;
            expect(config.consumedServices).is.equal(customConfig.consumedServices)
            expect(config.consumedServices).is.not.equal(defaultConfig.consumedServices)
        });

        it ('should set default serviceName if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.serviceName = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.serviceName).not.undefined;
            expect(config.consumedServices.mockId.serviceName).is.equal(defaultConfig.consumedServices.defaultServiceId.serviceName)
        });

        it ('should not set default serviceName if custom config has valid property', () => {
            expect(customConfig.consumedServices.mockId.serviceName).is.not.undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.serviceName).not.undefined;
            expect(config.consumedServices.mockId.serviceName).is.equal(customConfig.consumedServices.mockId.serviceName)
            expect(config.consumedServices.mockId.serviceName).is.not.equal(defaultConfig.consumedServices.defaultServiceId.serviceName)
        });

        it ('should set service.isValid=False if custom config does not have a valid healthCheckURL', () => {
            customConfig.consumedServices.mockId.healthCheckUrl = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.healthCheckUrl).is.undefined;
            expect(config.consumedServices.mockId.isValid).is.false;
        });

        it ('should set default service.requestMethod if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.requestMethod = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).not.undefined;
            expect(config.consumedServices.mockId.requestMethod).is.equal(defaultConfig.consumedServices.defaultServiceId.requestMethod)
        });

        it ('should set service.isValid=False if custom config does not have a valid requestMethod', () => {
            customConfig.consumedServices.mockId.requestMethod = 'GET_MOCK';
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.isValid).is.false;
        });

        it ('should accept requestMethod without any case sensitive restrictions', () => {
            customConfig.consumedServices.mockId.requestMethod = 'get';
            let config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.equal('GET');
            expect(config.consumedServices.mockId.isValid).is.true;

            customConfig.consumedServices.mockId.requestMethod = 'Get';
            config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.equal('GET');
            expect(config.consumedServices.mockId.isValid).is.true;

            customConfig.consumedServices.mockId.requestMethod = 'gEt';
            config = configValidator(customConfig);
            expect(config.consumedServices.mockId.requestMethod).is.equal('GET');
            expect(config.consumedServices.mockId.isValid).is.true;
        });

        it ('should set default service.expectedResponseStatus if custom config does not have a valid property', () => {
            customConfig.consumedServices.mockId.expectedResponseStatus = undefined;
            const config = configValidator(customConfig);
            expect(config.consumedServices.mockId.expectedResponseStatus).is.not.undefined;
            expect(config.consumedServices.mockId.expectedResponseStatus).is.equal(defaultConfig.consumedServices.defaultServiceId.expectedResponseStatus)
        });
    });

    describe("should validate api configurations", () => {
        it ('should set default config if custom config does not have valid apis config', () => {
            customConfig.apis = undefined;
            const config = configValidator(customConfig);
            expect(config.apis).not.undefined;
            expect(config.apis).is.empty
        });

        it ('should set default apiName if custom config does not have valid property', () => {
            customConfig.apis = { mockId: {}};
            const config = configValidator(customConfig);
            expect(config.apis.mockId.apiName).not.undefined;
            expect(config.apis.mockId.apiName).is.equal(defaultConfig.apis.defaultApi.apiName)
        });

        it ('should set default requestMethod if custom config does not have valid property', () => {
            customConfig.apis = { mockId: {}};
            let config = configValidator(customConfig);
            expect(config.apis.mockId.requestMethod).not.undefined;
            expect(config.apis.mockId.requestMethod).is.equal(defaultConfig.apis.defaultApi.requestMethod)

            customConfig.apis = { mockId: { requestMethod: "GET_UPPER" }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.requestMethod).not.equal("GET_UPPER");
            expect(config.apis.mockId.requestMethod).is.equal(defaultConfig.apis.defaultApi.requestMethod)
        });

        it ('should set default dependsOn config if custom config does not have valid property', () => {
            customConfig.apis = { mockId: {}};
            let config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn).not.undefined;
            expect(config.apis.mockId.dependsOn).is.instanceOf(Array)

            customConfig.apis = { mockId: { dependsOn: {}}};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn).is.instanceOf(Array)
        });

        it ('should set dependsOn service isValid=False if custom config does not have a valid property', () => {
            customConfig.apis = { mockId: { dependsOn: [{}] }};
            let config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isValid).false;

            customConfig.apis = { mockId: { dependsOn: [{ serviceId: "defaultServiceId" }] }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isValid).false

            customConfig.apis = { mockId: { dependsOn: [{ serviceId: "mockId" }] }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isValid).true;
        });

        it ('should set default isRequired if custom config does not have a valid property for API depends on', () => {
            customConfig.apis = { mockId: { dependsOn: [{ serviceId: "defaultServiceId" }] }};
            let config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isRequired).is.not.undefined;
            expect(config.apis.mockId.dependsOn[0].isRequired).is.equal(defaultConfig.apis.defaultApi.dependsOn[0].isRequired)

            customConfig.apis = { mockId: { dependsOn: [{ serviceId: "defaultServiceId", isRequired: false }] }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isRequired).is.equal(customConfig.apis.mockId.dependsOn[0].isRequired)

            customConfig.apis = { mockId: { dependsOn: [{ serviceId: "defaultServiceId", isRequired: true }] }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isRequired).is.equal(customConfig.apis.mockId.dependsOn[0].isRequired)

            customConfig.apis = { mockId: { dependsOn: [{ serviceId: "defaultServiceId", isRequired: "ABC" }] }};
            config = configValidator(customConfig);
            expect(config.apis.mockId.dependsOn[0].isRequired).is.not.equals("ABC");
            expect(config.apis.mockId.dependsOn[0].isRequired).is.equal(defaultConfig.apis.defaultApi.dependsOn[0].isRequired)
        });
    });

    describe("should validate system information configurations", () => {
        it ("should set valid systemInformation if custom config have a invalid property", () => {
            customConfig.systemInformation = undefined;
            let config = configValidator(customConfig);
            expect(config.systemInformation).is.not.undefined;
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation).is.equal(defaultConfig.systemInformation)
            expect(config.systemInformation).not.haveOwnProperty("services")

            customConfig.systemInformation = "ABC"
            config = configValidator(customConfig);
            expect(config.systemInformation).is.not.equal("ABC");
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation).is.equal(defaultConfig.systemInformation)
            expect(config.systemInformation).not.haveOwnProperty("services")
        })

        it ("should systemInformation accept booleans to represent the whole response state", () => {
            customConfig.systemInformation = true 
            let config = configValidator(customConfig);
            expect(config.systemInformation).is.not.true;
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation).is.equal(defaultConfig.systemInformation)
            expect(config.systemInformation).not.haveOwnProperty("services")

            customConfig.systemInformation = false
            config = configValidator(customConfig);
            expect(config.systemInformation).is.not.false
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation.common).false;
            expect(config.systemInformation.cpu).false;
            expect(config.systemInformation.memory).false;
            expect(config.systemInformation).not.haveOwnProperty("services")
        })

        it ("should systemInformation accept valid object properties to represent the each response state", () => {
            customConfig.systemInformation = { common: true, cpu: true, memory: true}
            let config = configValidator(customConfig);
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation.common).true;
            expect(config.systemInformation.cpu).true;
            expect(config.systemInformation.memory).true;
            expect(config.systemInformation).not.haveOwnProperty("services")

            customConfig.systemInformation = { common: true, cpu: false, memory: true}
            config = configValidator(customConfig);
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation.common).true;
            expect(config.systemInformation.cpu).false;
            expect(config.systemInformation.memory).true;
            expect(config.systemInformation).not.haveOwnProperty("services")

            customConfig.systemInformation = { common: false, cpu: false, memory: false}
            config = configValidator(customConfig);
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation.common).false;
            expect(config.systemInformation.cpu).false;
            expect(config.systemInformation.memory).false;
            expect(config.systemInformation).not.haveOwnProperty("services")

            customConfig.systemInformation = { common: "Abc", cpu: "123", memory: 45 }
            config = configValidator(customConfig);
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation.common).true;
            expect(config.systemInformation.cpu).true;
            expect(config.systemInformation.memory).true;
            expect(config.systemInformation).not.haveOwnProperty("systemInforservicesmation")

            customConfig.systemInformation = { services: ["abc", "cde"] }
            config = configValidator(customConfig);
            expect(typeof config.systemInformation).is.equal("object");
            expect(config.systemInformation.common).true;
            expect(config.systemInformation.cpu).true;
            expect(config.systemInformation.memory).true;
            expect(config.systemInformation).haveOwnProperty("services")
            expect(config.systemInformation.services).equal("abc,cde")
        })
    })
});