// server/utils/useClientInfo.js

export default function useClientInfo(event) {
  return {
    ipAddress: getRequestIP(event, { xForwardedFor: true }),
    userAgent: getRequestHeader(event, 'user-agent'),
  };
}
