// config.ts
import { HumanSecurityConfiguration } from '@humansecurity/aws-lambda-edge-enforcer';
import * as https from 'https';

// define configuration
const config: HumanSecurityConfiguration = {
    // Mandatory configurations
    px_app_id: '<APP_ID>',
    px_auth_token: '<AUTH_TOKEN>',
    px_cookie_secret: '<COOKIE_SECRET>',

    // View all available configuration options: https://edocs.humansecurity.com/docs/configuration-aws-lambda-edge
    px_logger_auth_token: '',
    px_blocking_score: 70,
    px_logger_severity: 'debug',
    px_module_mode: "active_blocking",
    px_s2s_timeout: 1000,
    px_deferred_activities: false,
    px_custom_logo: 'http://px_custom.logo.px.com',
    px_first_party_enabled: true,
    px_js_ref: 'http://px_custom.js.px.com',
    px_css_ref: 'http://px_custom.css.px.com',
    px_user_agent_max_length: 8528,
    px_risk_cookie_max_length: 2048,
    px_risk_cookie_max_iterations: 5000,
    px_risk_cookie_min_iterations: 1,
    px_custom_first_party_sensor_endpoint: '/custom_first_party_sensor_endpoint',
    px_custom_first_party_xhr_endpoint: '/custom_first_party_xhr_endpoint',
    px_custom_first_party_captcha_endpoint: '/custom_first_party_captcha_endpoint',
    px_custom_first_party_prefix: '/custom_first_party_prefix',
    px_filter_by_route: ['/filtered_route*'],
    px_monitored_routes: ['/monitored_route'],
    px_sensitive_routes: ['/profile1', '/profile2', '/profile2/login/user'],
    px_sensitive_headers: ['sensitive_header1', 'sensitive_header2'],
    px_ip_headers: ['px-ip-header-test'],
    px_filter_by_extension: ['css', 'bmp', 'tif'],
    px_filter_by_http_method: ['DELETE'],
    px_filter_by_ip: ['10.21.21.21', '21.0.0.0/8'],
    px_filter_by_user_agent: ['test-agent'],
    px_advanced_blocking_response_enabled: true,
    px_sensitive_graphql_operation_types: ['mutation'],
    px_sensitive_graphql_operation_names: ['SensitiveOperation'],
    px_graphql_routes: ['/custom/graphql'],
    px_send_raw_username_on_additional_s2s_activity: true,
    px_login_credentials_extraction_enabled: true,
    px_automatic_additional_s2s_activity_enabled: true,
    px_url_decode_reserved_characters: true,
    px_login_credentials_extraction: [
        {
            method: 'POST',
            path: '/login',
            sent_through: 'body',
            pass_field: 'password',
            user_field: 'username',
            login_successful_reporting_method: 'status',
        },
        {
            method: 'POST',
            path: '/login-nested-object',
            sent_through: 'body',
            pass_field: 'nested.password',
            user_field: 'nested.username',
            login_successful_reporting_method: 'status',
        },
        {
            method: 'POST',
            path: '/login-header',
            sent_through: 'header',
            pass_field: 'password',
            user_field: 'username',
            login_successful_reporting_method: 'status',
        },
        {
            method: 'PUT',
            path: '/login-params',
            sent_through: 'query-param',
            pass_field: 'password',
            user_field: 'username',
            login_successful_reporting_method: 'status',
        },
    ],
    px_jwt_cookie_name: 'authCookie',
    px_jwt_cookie_user_id_field_name: 'idFromCookie',
    px_jwt_cookie_additional_field_names: ['expFromCookie', 'issFromCookie'],
    px_jwt_header_name: 'auth_header',
    px_jwt_header_user_id_field_name: 'idFromHeader',
    px_jwt_header_additional_field_names: ['expFromHeader', 'issFromHeader'],
    px_cors_support_enabled: true,
    px_cors_preflight_request_filter_enabled: true,

    //Custom function configurations
    px_enrich_custom_parameters: (config, request) => {
        return {
            custom_param1: 'test1',
            custom_param2: 'test2',
            custom_param3: 3,
            custom_param4: 4,
            custom_param5: 5,
            custom_param6: 6,
            is_hype_sale: request.uri === '/hype-sale',
        };
    },
    px_additional_activity_handler: async (config, context) => {
        try {
            const req = https.request({
                hostname: config.px_backend_collector_url.replace(/https?:\/\//g, ''),
                path: '/internal' + context.requestData.url.pathname + context.requestData.url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            req.write(
                JSON.stringify({
                    _pxde: context.pxde,
                    pxdeVerified: context.pxdeVerified,
                    pxScore: context.score,
                }),
            );
            req.end();
        } catch {
            // intentionally left blank
        }
    },
    px_cors_custom_preflight_handler: () => {
        return Promise.resolve({
            headers: { 'Access-Control-Allow-Origin': ['test'] },
            body: 'test',
            status: 303,
        });
    },
};

export async function getConfigAsync(){
    //here you can use  async/await syntax for blocking requests
    return config;
}
