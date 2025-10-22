Write-Host "?? Running API Diagnostic..." -ForegroundColor Yellow

# Check server
Write-Host "
1. Checking server on port 3000..." -ForegroundColor Cyan
try {
     = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "   ? Server is running" -ForegroundColor Green
} catch {
    Write-Host "   ? Server not running on port 3000" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
    exit
}

# Check API routes
Write-Host "
2. Checking API route files..." -ForegroundColor Cyan
 = @(
    "app\api\codes\route.js",
    "app\api\codes\[id]\route.js",
    "lib\db.js"
)

foreach ( in ) {
    if (Test-Path ) {
        Write-Host "   ?  exists" -ForegroundColor Green
    } else {
        Write-Host "   ?  missing" -ForegroundColor Red
    }
}

# Test API endpoint
Write-Host "
3. Testing /api/codes endpoint..." -ForegroundColor Cyan
try {
     = Invoke-WebRequest -Uri "http://localhost:3000/api/codes" -UseBasicParsing
    Write-Host "   ? API responded with status: " -ForegroundColor Green
} catch {
    Write-Host "   ? API error: " -ForegroundColor Red
}

Write-Host "
?? Diagnostic complete!" -ForegroundColor Yellow
