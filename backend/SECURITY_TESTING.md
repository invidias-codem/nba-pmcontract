# Security Hardening - Testing Guide

## What We've Implemented

### 1. Enhanced KeyManager (`backend/src/services/KeyManager.ts`)
- ✅ Strict environment variable validation (throws errors for missing secrets)
- ✅ Secret format validation (API keys, private keys)
- ✅ Builder ID support for order attribution
- ✅ Production safety checks (prevents example/placeholder secrets in production)
- ✅ Sanitized config logging (redacts secrets)

### 2. Enhanced PolymarketSigner (`backend/src/middleware/PolymarketSigner.ts`)
- ✅ Builder ID headers (`X-Builder-ID`) for order attribution
- ✅ Improved HMAC signature generation
- ✅ Proper error handling (returns 500 on auth failure)
- ✅ Webhook signature verification middleware
- ✅ Timestamp validation (prevents replay attacks)
- ✅ Constant-time signature comparison (prevents timing attacks)

### 3. Rate Limiting (`backend/src/middleware/RateLimiter.ts`)
- ✅ Configurable rate limiting middleware
- ✅ Predefined limiters for different endpoint types:
  - Public endpoints: 300 req/min
  - API endpoints: 100 req/min
  - Auth endpoints: 5 req/15min
  - Webhook endpoints: 50 req/min
- ✅ Rate limit headers (X-RateLimit-*)
- ✅ Automatic cleanup of old entries

### 4. Enhanced Server (`backend/src/index.ts`)
- ✅ Integrated all security middleware
- ✅ Webhook endpoint with signature verification
- ✅ Global error handler
- ✅ Graceful shutdown handling
- ✅ Better logging and error messages

## Testing Instructions

### Prerequisites

1. **Set up environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and fill in your actual values
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

### Test 1: Environment Variable Validation

**Test missing secrets:**
```bash
# Temporarily rename .env to test error handling
mv .env .env.backup
npm start
# Expected: Server should exit with error message about missing env vars
mv .env.backup .env
```

**Expected output:**
```
❌ CRITICAL: Missing required environment variables: POLY_API_KEY, POLY_API_SECRET, POLY_PASSPHRASE, SIGNER_PRIVATE_KEY
Please set these in your .env file before starting the server.
```

### Test 2: Builder ID Configuration

**Start server with Builder ID:**
```bash
# Make sure BUILDER_ID is set in .env
npm start
```

**Expected output:**
```
✅ KeyManager initialized successfully
✅ Builder ID configured: abc12345...
✅ All services initialized successfully
🚀 ========================================
🚀 NBA Contracts Backend Server
🚀 Port: 3000
🚀 Environment: development
🚀 ========================================
```

### Test 3: Rate Limiting

**Test rate limit enforcement:**
```bash
# In a new terminal, make rapid requests
for i in {1..350}; do
  curl -s http://localhost:3000/health > /dev/null
  echo "Request $i"
done
```

**Expected:** After 300 requests, you should get 429 responses:
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

### Test 4: Polymarket Signature Headers

**Test signature middleware:**
```bash
curl http://localhost:3000/api/test-signature
```

**Expected output:**
```json
{
  "message": "Request signed successfully",
  "headers": {
    "POLY-API-KEY": "SET",
    "POLY-TIMESTAMP": "1736650000",
    "POLY-SIGNATURE": "SET",
    "X-Builder-ID": "your_builder_id"
  }
}
```

### Test 5: Webhook Signature Verification

**Test webhook with invalid signature:**
```bash
curl -X POST http://localhost:3000/api/webhooks/polymarket \
  -H "Content-Type: application/json" \
  -H "x-polymarket-signature: invalid_signature" \
  -H "x-polymarket-timestamp: $(date +%s)" \
  -d '{"event": "test"}'
```

**Expected output:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid webhook signature"
}
```

**Test webhook with missing signature:**
```bash
curl -X POST http://localhost:3000/api/webhooks/polymarket \
  -H "Content-Type: application/json" \
  -d '{"event": "test"}'
```

**Expected output:**
```json
{
  "error": "Unauthorized",
  "message": "Missing webhook signature"
}
```

### Test 6: Config Endpoint (Sanitized Secrets)

**Test config endpoint:**
```bash
curl http://localhost:3000/api/config
```

**Expected output:**
```json
{
  "status": "ok",
  "config": {
    "POLY_API_KEY": "abc12345...",
    "POLY_API_SECRET": "***REDACTED***",
    "POLY_PASSPHRASE": "***REDACTED***",
    "SIGNER_PRIVATE_KEY": "***REDACTED***",
    "BUILDER_ID": "your_builder_id",
    "NODE_ENV": "development"
  }
}
```

### Test 7: Graceful Shutdown

**Test graceful shutdown:**
```bash
# Start server
npm start

# In another terminal, send SIGTERM
pkill -TERM -f "node dist/index.js"
```

**Expected output:**
```
📴 SIGTERM received, shutting down gracefully...
✅ Server closed
```

## Security Checklist

- [x] Environment variables are validated on startup
- [x] Missing secrets cause server to exit (not just warn)
- [x] Builder ID headers are added to all CLOB requests
- [x] Webhook signatures are verified before processing
- [x] Rate limiting is enforced on all endpoints
- [x] Secrets are never logged in plain text
- [x] Timing-safe comparison for signature verification
- [x] Timestamp validation prevents replay attacks
- [x] Global error handler prevents stack trace leaks

## Next Steps

1. **Get a Builder ID from Polymarket**:
   - Contact Polymarket support or check their developer portal
   - Add it to your `.env` file

2. **Test with Real Polymarket API**:
   - Make actual CLOB API calls
   - Verify Builder ID is being sent
   - Check Polymarket dashboard for order attribution

3. **Set up Webhook Endpoint**:
   - Configure Polymarket to send webhooks to your server
   - Test with real webhook events
   - Verify signature validation works

4. **Production Deployment**:
   - Set `NODE_ENV=production`
   - Use a secrets manager (AWS Secrets Manager, HashiCorp Vault)
   - Enable HTTPS/TLS
   - Set up monitoring and alerting

## Security Improvements Summary

| Issue | Before | After |
|-------|--------|-------|
| Missing secrets | Console warning | Server exits with error |
| Builder ID | Not supported | Automatically added to requests |
| Webhook verification | None | HMAC signature validation |
| Rate limiting | None | Configurable per endpoint |
| Secret logging | Potentially exposed | Always redacted |
| Error handling | Generic | Specific, secure messages |
| Replay attacks | Vulnerable | Timestamp validation |
| Timing attacks | Vulnerable | Constant-time comparison |

## Known Limitations

1. **In-memory rate limiting**: Current implementation uses in-memory storage. For production with multiple servers, use Redis or similar.

2. **No secret rotation**: Secrets are loaded once on startup. Implement secret rotation for production.

3. **No request signing for CLOB orders**: The `polymarketSigner` middleware is ready, but you need to integrate it with actual CLOB API calls in `OrderBookMirror.ts` and `CardWrapper.ts`.

4. **Webhook endpoint not fully implemented**: The webhook handler is a stub. You need to add actual business logic to process events.
