$BASE = "http://localhost:5001/api"

# Login admin
$lAdm = (Invoke-WebRequest -Uri "$BASE/auth/login" -Method POST -Body (ConvertTo-Json @{email="admin@test.com";password="Test123456"}) -ContentType "application/json" -UseBasicParsing).Content | ConvertFrom-Json
$tok = $lAdm.data.token
Write-Host "Admin role:" $lAdm.data.user.role
Write-Host "Token starts:" $tok.Substring(0,20)

# Get existing business
$bizResp = (Invoke-WebRequest -Uri "$BASE/business/my" -Headers @{Authorization="Bearer $tok"} -UseBasicParsing).Content | ConvertFrom-Json
$biz = $bizResp.data.businesses
Write-Host "Businesses count:" $biz.Count
if ($biz.Count -gt 0) {
    $bizId = $biz[0]._id
    Write-Host "Using bizId:" $bizId
} else {
    # Create business
    Write-Host "No business found, creating..."
    $newBiz = (Invoke-WebRequest -Uri "$BASE/business" -Method POST -Body (ConvertTo-Json @{name="Debug Biz";category="Healthcare";address="1 Main";city="Lahore"}) -ContentType "application/json" -Headers @{Authorization="Bearer $tok"} -UseBasicParsing).Content | ConvertFrom-Json
    $bizId = $newBiz.data._id
    Write-Host "Created bizId:" $bizId
}

# Try create queue
$qBody = ConvertTo-Json @{title="Debug Queue";businessId=$bizId;maxUsers=10}
Write-Host "Queue body:" $qBody
$qResp = Invoke-WebRequest -Uri "$BASE/queues" -Method POST -Body $qBody -ContentType "application/json" -Headers @{Authorization="Bearer $tok"} -UseBasicParsing -ErrorAction SilentlyContinue
Write-Host "Queue create HTTP:" $qResp.StatusCode
Write-Host "Queue create body:" $qResp.Content

# Test analytics
$aResp = Invoke-WebRequest -Uri "$BASE/analytics/overview" -Headers @{Authorization="Bearer $tok"} -UseBasicParsing -ErrorAction SilentlyContinue
Write-Host "Analytics HTTP:" $aResp.StatusCode
Write-Host "Analytics body:" $aResp.Content.Substring(0,[Math]::Min(200,$aResp.Content.Length))
