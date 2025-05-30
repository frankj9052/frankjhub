export const RateLimiterStrategies = {
  login: {
    points: 10,
    duration: 900,
    blockDuration: 900,
    keyPrefix: 'login_fail_ip',
  },
  signup: {
    points: 5,
    duration: 600,
    blockDuration: 1800,
    keyPrefix: 'signup_fail_ip',
  },
};
