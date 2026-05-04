$BASE = "http://localhost:5001/api"

Write-Host ""
Write-Host "=== STEP 1: Register Test Users ===" -ForegroundColor Cyan

$users = @(
    @{ name="User A";     email="usera@test.com";       password="Test123456" },
    @{ name="User B";     email="userb@test.com";       password="Test123456" },
    @{ name="Admin";      email="admin@test.com";       password="Test123456" },
    @{ name="SuperAdmin"; email="superadmin@test.com";  password="Test123456" }
)

foreach ($u in $users) {
    $body = ConvertTo-Json $u
    $resp = Invoke-WebRequest -Uri "$BASE/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($resp) {
        Write-Host ("  HTTP {0}  {1}" -f $resp.StatusCode, $u.email) -ForegroundColor $(if ($resp.StatusCode -lt 300) { "Green" } else { "Yellow" })
    } else {
        Write-Host ("  Already exists or error: {0}" -f $u.email) -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== STEP 2: Set Roles via Node.js ===" -ForegroundColor Cyan
node "docs/testing/set-roles.mjs"

Write-Host ""
Write-Host "Done. Now run: powershell -ExecutionPolicy Bypass -File docs\testing\run_tests.ps1" -ForegroundColor Green
Write-Host ""
