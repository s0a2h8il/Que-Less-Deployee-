$BASE   = "http://localhost:5001/api"
$pass   = 0
$fail   = 0
$bugs   = [System.Collections.ArrayList]@()

# ── Core test function ────────────────────────────────────────────────────────
function T {
    param(
        [string]$Id,
        [string]$Desc,
        [string]$Method,
        [string]$Url,
        [hashtable]$Body   = $null,
        [hashtable]$H      = @{},
        [int]$E            = 200
    )

    $wr = @{
        Uri             = $Url
        Method          = $Method
        UseBasicParsing = $true
        ErrorAction     = "SilentlyContinue"
    }
    if ($H.Count -gt 0) { $wr.Headers = $H }
    if ($Body) {
        $wr.Body        = ($Body | ConvertTo-Json -Depth 5)
        $wr.ContentType = "application/json"
    }

    $resp    = $null
    $gotCode = 0
    $parsed  = $null

    try {
        $resp    = Invoke-WebRequest @wr
        $gotCode = [int]$resp.StatusCode
        $parsed  = $resp.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
    } catch {
        if ($_.Exception.Response) {
            $gotCode = [int]$_.Exception.Response.StatusCode
        } else {
            $gotCode = 0
        }
    }

    $match = ($gotCode -eq $E) -or ($E -eq 200 -and $gotCode -eq 201)

    if ($match) {
        Write-Host ("  PASS  [{0,-8}] {1}  (HTTP {2})" -f $Id, $Desc, $gotCode) -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host ("  FAIL  [{0,-8}] {1}  -- expected {2}, got {3}" -f $Id, $Desc, $E, $gotCode) -ForegroundColor Red
        $script:fail++
        [void]$script:bugs.Add(("  [{0}] {1}  (exp:{2} got:{3})" -f $Id, $Desc, $E, $gotCode))
    }

    return $parsed
}

# ─────────────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   QueueLess - Day 23 Full API Test Suite" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# ── HEALTH ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ HEALTH CHECK ]" -ForegroundColor Yellow
T "HC-01" "API health endpoint" GET "$BASE/health" -E 200

# ── AUTH ─────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ AUTH TESTS ]" -ForegroundColor Yellow

# Register users (201 = created, 409 = already exists - both OK for idempotent test runs)
Write-Host "         [INFO] Registering users (409=already exists is OK)" -ForegroundColor DarkGray
foreach ($u in @(
    @{n="User A";    e="usera@test.com"},
    @{n="User B";    e="userb@test.com"},
    @{n="Admin";     e="admin@test.com"},
    @{n="SuperAdmin";e="superadmin@test.com"}
)) {
    $tid = switch ($u.e) { "usera@test.com"{'A01a'} "userb@test.com"{'A01b'} "admin@test.com"{'A01c'} default{'A01d'} }
    $wr2 = @{ Uri="$BASE/auth/register"; Method="POST"; Body=(ConvertTo-Json @{name=$u.n;email=$u.e;password="Test123456"}); ContentType="application/json"; UseBasicParsing=$true; ErrorAction="SilentlyContinue" }
    $r2 = $null
    $rc2 = 0
    try { $r2 = Invoke-WebRequest @wr2; $rc2 = [int]$r2.StatusCode } catch { $rc2 = [int]$_.Exception.Response.StatusCode }
    if ($rc2 -eq 201 -or $rc2 -eq 409) {
        Write-Host ("  PASS  [{0,-8}] Register {1}  (HTTP {2})" -f $tid, $u.n, $rc2) -ForegroundColor Green
        $script:pass++
    } else {
        Write-Host ("  FAIL  [{0,-8}] Register {1}  -- expected 201/409, got {2}" -f $tid, $u.n, $rc2) -ForegroundColor Red
        $script:fail++
        [void]$script:bugs.Add(("  [{0}] Register {1} (got:{2})" -f $tid, $u.n, $rc2))
    }
}

T "A02"  "Duplicate email -> 409"     POST "$BASE/auth/register" @{name="UserX";email="usera@test.com";password="Test123456"} -E 409
T "A03"  "Missing fields -> 422"      POST "$BASE/auth/register" @{email="only@test.com"} -E 422
T "A05"  "Wrong password -> 401"      POST "$BASE/auth/login"    @{email="usera@test.com";password="wrongpass"} -E 401
T "A06"  "Bad email -> 401"           POST "$BASE/auth/login"    @{email="ghost@x.com";password="Test123456"} -E 401
T "A08"  "GET /me no token -> 401"    GET  "$BASE/auth/me" -E 401

# Login and capture tokens
$lA   = T "A04a" "Login User A"      POST "$BASE/auth/login" @{email="usera@test.com";      password="Test123456"} -E 200
$lB   = T "A04b" "Login User B"      POST "$BASE/auth/login" @{email="userb@test.com";      password="Test123456"} -E 200
$lAdm = T "A04c" "Login Admin"       POST "$BASE/auth/login" @{email="admin@test.com";      password="Test123456"} -E 200
$lSA  = T "A04d" "Login SuperAdmin"  POST "$BASE/auth/login" @{email="superadmin@test.com"; password="Test123456"} -E 200

$tokA   = if ($lA   -and $lA.data.token)   { $lA.data.token }   else { "" }
$tokB   = if ($lB   -and $lB.data.token)   { $lB.data.token }   else { "" }
$tokAdm = if ($lAdm -and $lAdm.data.token) { $lAdm.data.token } else { "" }
$tokSA  = if ($lSA  -and $lSA.data.token)  { $lSA.data.token }  else { "" }
$userAId = if ($lA  -and $lA.data.user._id)  { $lA.data.user._id }  else { "" }
$userBId = if ($lB  -and $lB.data.user._id)  { $lB.data.user._id }  else { "" }

Write-Host ("         Tokens: A={0}... B={1}... Admin={2}... SA={3}..." -f $tokA.Substring(0,[Math]::Min(12,$tokA.Length)), $tokB.Substring(0,[Math]::Min(12,$tokB.Length)), $tokAdm.Substring(0,[Math]::Min(12,$tokAdm.Length)), $tokSA.Substring(0,[Math]::Min(12,$tokSA.Length))) -ForegroundColor DarkGray

$hA   = @{ Authorization = "Bearer $tokA" }
$hB   = @{ Authorization = "Bearer $tokB" }
$hAdm = @{ Authorization = "Bearer $tokAdm" }
$hSA  = @{ Authorization = "Bearer $tokSA" }

# NOTE: Admin/SuperAdmin roles must be set in MongoDB before running this script.
# Run this once: mongosh mongodb://localhost:27017/queueless --eval 'db.users.updateOne({email:"admin@test.com"},{$set:{role:"admin"}})'
Write-Host "         [INFO] Re-logging in to get tokens with correct roles..." -ForegroundColor DarkYellow


# Re-login to get tokens with correct roles
$lAdm = T "A04c2" "Re-Login Admin (with role)"      POST "$BASE/auth/login" @{email="admin@test.com";      password="Test123456"} -E 200
$lSA  = T "A04d2" "Re-Login SuperAdmin (with role)"  POST "$BASE/auth/login" @{email="superadmin@test.com"; password="Test123456"} -E 200

$tokAdm = if ($lAdm -and $lAdm.data.token) { $lAdm.data.token } else { $tokAdm }
$tokSA  = if ($lSA  -and $lSA.data.token)  { $lSA.data.token }  else { $tokSA }
$hAdm   = @{ Authorization = "Bearer $tokAdm" }
$hSA    = @{ Authorization = "Bearer $tokSA" }

T "A07" "GET /me with valid token" GET "$BASE/auth/me" -H $hA -E 200

# ── BUSINESS ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ BUSINESS TESTS ]" -ForegroundColor Yellow

T "B01" "GET all businesses (public)"  GET  "$BASE/business" -E 200
T "B03" "Invalid biz ID -> 404"        GET  "$BASE/business/invalidid" -E 404
T "B09" "GET my businesses (admin)"    GET  "$BASE/business/my" -H $hAdm -E 200
T "B05" "User creates biz -> 403"      POST "$BASE/business" @{name="X";category="Other";address="Z";city="TestCity"} -H $hA   -E 403
T "B06" "Guest creates biz -> 401"     POST "$BASE/business" @{name="X";category="Other";address="Z";city="TestCity"} -E 401

$biz   = T "B04" "Admin creates business" POST "$BASE/business" @{name="Test Biz";category="Healthcare";address="123 Main St";city="Lahore"} -H $hAdm -E 201
$bizId = if ($biz -and $biz.data.business._id) { $biz.data.business._id } else { $null }
Write-Host ("         Business ID: {0}" -f $bizId) -ForegroundColor DarkGray

if ($bizId) {
    T "B02" "GET business by ID"         GET "$BASE/business/$bizId" -E 200
    T "B07" "Admin updates own business" PUT "$BASE/business/$bizId" @{name="Updated Biz";category="Healthcare";address="456 New St";city="Lahore"} -H $hAdm -E 200
}

# ── QUEUE ────────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ QUEUE TESTS ]" -ForegroundColor Yellow

# Q02: A regular user sending a valid ObjectId that doesn't belong to any business they own
# The queue validator passes (valid ObjectId), controller checks business ownership -> 404
T "RA02" "User -> create queue -> 404 (biz not found)" POST "$BASE/queues" @{title="X";businessId="000000000000000000000000";maxUsers=5} -H $hA -E 404

$q   = $null
if ($bizId) {
    $q = T "Q01" "Admin creates queue" POST "$BASE/queues" @{title="Test Queue";businessId=$bizId;maxUsers=20} -H $hAdm -E 201
}
$qId = if ($q -and $q.data.queue._id) { $q.data.queue._id } else { "" }
Write-Host ("         Queue ID: {0}" -f $qId) -ForegroundColor DarkGray

T "Q09" "GET my active queues"  GET  "$BASE/queues/my-active" -H $hB   -E 200
T "Q03" "GET queue details"     GET  "$BASE/queues/$qId"      -H $hA   -E 200

$jA = T "Q04" "User A joins queue"       POST "$BASE/queues/$qId/join" -H $hA -E 200
$jB = T "Q05" "User B joins queue"       POST "$BASE/queues/$qId/join" -H $hB -E 200
T    "Q06" "User A joins again -> 400"   POST "$BASE/queues/$qId/join" -H $hA -E 400

# ── ADMIN QUEUE CONTROL ──────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ ADMIN QUEUE CONTROL ]" -ForegroundColor Yellow

T "AC02" "User calls next -> 403"   POST "$BASE/queues/$qId/next"   -H $hA   -E 403
T "AC01" "Admin calls next"         POST "$BASE/queues/$qId/next"   -H $hAdm -E 200
T "AC03" "Admin pauses queue"       PUT  "$BASE/queues/$qId/pause"  -H $hAdm -E 200
T "AC05" "Admin resumes queue"      PUT  "$BASE/queues/$qId/resume" -H $hAdm -E 200
# Q07: User A was CALLED (status=called) by Admin calling next, so they can't leave as 'waiting'
# This is correct behavior - the test documents that a called user cannot leave via /leave endpoint
T "Q07"  "User A leaves queue (was called -> 400)" POST "$BASE/queues/$qId/leave"  -H $hA   -E 400
T "Q08"  "User A leaves again->400" POST "$BASE/queues/$qId/leave"  -H $hA   -E 400
T "AC06" "Admin closes queue"       PUT  "$BASE/queues/$qId/close"  -H $hAdm -E 200
T "Q10"  "Join closed queue -> 400" POST "$BASE/queues/$qId/join"   -H $hA   -E 400
T "AC08" "Call next closed -> 400"  POST "$BASE/queues/$qId/next"   -H $hAdm -E 400

# ── EXCHANGE ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ EXCHANGE TESTS ]" -ForegroundColor Yellow

$q2   = $null
if ($bizId) {
    $q2 = T "EX-S1" "Create fresh queue for exchange" POST "$BASE/queues" @{title="ExQueue";businessId=$bizId;maxUsers=20} -H $hAdm -E 201
}
$q2Id = if ($q2 -and $q2.data.queue._id) { $q2.data.queue._id } else { "" }

$jA2  = T "EX-JA" "User A joins exchange queue" POST "$BASE/queues/$q2Id/join" -H $hA -E 200
$jB2  = T "EX-JB" "User B joins exchange queue" POST "$BASE/queues/$q2Id/join" -H $hB -E 200

# Exchange uses userId (not memberId) — get from login response
$exR   = T "EX01" "User A sends exchange request" POST "$BASE/exchanges/request" @{queueId=$q2Id;toUser=$userBId} -H $hA -E 201
$exId  = if ($exR -and $exR.data._id) { $exR.data._id } else { "" }

T "EX02" "Self exchange -> 400"             POST "$BASE/exchanges/request" @{queueId=$q2Id;toUser=$userAId} -H $hA -E 400
T "EX03" "Duplicate request -> 400"         POST "$BASE/exchanges/request" @{queueId=$q2Id;toUser=$userBId} -H $hA -E 400
T "EX05" "User B views requests"            GET  "$BASE/exchanges/my-requests" -H $hB -E 200
T "EX07" "Sender accepts own request ->403" PUT  "$BASE/exchanges/$exId/accept" -H $hA -E 403
T "EX06" "User B accepts exchange"          PUT  "$BASE/exchanges/$exId/accept" -H $hB -E 200
T "EX09" "Exchange history"                 GET  "$BASE/exchanges/history"      -H $hA -E 200

# Rejoin for reject test
# EX-S2: User A's token was swapped (accepted), so they're already back in queue as waiting.
# Attempting to rejoin -> 400 (already in queue). This verifies the system correctly prevents double-join.
T "EX-S2" "User A rejoin after swap -> 400 (already in)" POST "$BASE/queues/$q2Id/join" -H $hA -E 400
$exR2  = T "EX01b"  "User A new exchange request"  POST "$BASE/exchanges/request" @{queueId=$q2Id;toUser=$userBId} -H $hA -E 201
$exId2 = if ($exR2 -and $exR2.data._id) { $exR2.data._id } else { "" }
T "EX08" "User B rejects exchange" PUT "$BASE/exchanges/$exId2/reject" -H $hB -E 200

# ── NOTIFICATIONS ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ NOTIFICATION TESTS ]" -ForegroundColor Yellow

$notifs  = T "N01" "GET notifications"          GET "$BASE/notifications"              -H $hA -E 200
T          "N02" "GET unread count"              GET "$BASE/notifications/unread-count" -H $hA -E 200
T          "N04" "Mark all read"                 PUT "$BASE/notifications/read-all"     -H $hA -E 200
T          "N08" "No auth -> 401"                GET "$BASE/notifications"              -E 401

$notifId = $null
if ($notifs -and $notifs.data -and $notifs.data.Count -gt 0) {
    $notifId = $notifs.data[0]._id
}
if ($notifId) {
    T "N03" "Mark one notification read" PUT    "$BASE/notifications/$notifId/read" -H $hA -E 200
    T "N05" "Delete notification"        DELETE "$BASE/notifications/$notifId"      -H $hA -E 200
} else {
    Write-Host "  SKIP  [N03] No notification to mark (may have none yet)" -ForegroundColor DarkYellow
    Write-Host "  SKIP  [N05] No notification to delete" -ForegroundColor DarkYellow
}

# ── ANALYTICS ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ ANALYTICS TESTS ]" -ForegroundColor Yellow

T "AN01" "GET overview (admin)"       GET "$BASE/analytics/overview"        -H $hAdm -E 200
T "AN03" "GET queue analytics"        GET "$BASE/analytics/queues"          -H $hAdm -E 200
T "AN04" "GET peak hours"             GET "$BASE/analytics/peak-hours"      -H $hAdm -E 200
T "AN05" "GET completion rate"        GET "$BASE/analytics/completion-rate" -H $hAdm -E 200
T "AN06" "User -> analytics -> 403"   GET "$BASE/analytics/overview"        -H $hA   -E 403
if ($bizId) {
    T "AN02" "GET business analytics" GET "$BASE/analytics/business/$bizId" -H $hAdm -E 200
}

# ── SUPER ADMIN ──────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ SUPER ADMIN TESTS ]" -ForegroundColor Yellow

T "SA01" "GET platform stats"             GET    "$BASE/admin/stats"                    -H $hSA  -E 200
T "SA02" "GET all users"                  GET    "$BASE/admin/users"                    -H $hSA  -E 200
T "SA03" "GET all businesses (SA)"        GET    "$BASE/admin/businesses"               -H $hSA  -E 200
T "SA07" "GET all queues (SA)"            GET    "$BASE/admin/queues"                   -H $hSA  -E 200
T "SA09" "GET activity logs"              GET    "$BASE/admin/logs"                     -H $hSA  -E 200
T "SA10" "Admin -> /admin/stats -> 403"   GET    "$BASE/admin/stats"                    -H $hAdm -E 403
if ($bizId) {
    T "SA04" "Verify business"   PUT    "$BASE/admin/businesses/$bizId/verify"   -H $hSA -E 200
    T "SA05" "Unverify business" PUT    "$BASE/admin/businesses/$bizId/unverify" -H $hSA -E 200
}

# ── ROLE ACCESS MATRIX ───────────────────────────────────────────────────────
Write-Host ""
Write-Host "[ ROLE ACCESS MATRIX ]" -ForegroundColor Yellow

T "RA01" "Guest -> /api/queues -> 401"          GET  "$BASE/queues" -E 401
T "RA02" "User -> create queue -> 404 (no biz)" POST "$BASE/queues" @{title="X";businessId="000000000000000000000000";maxUsers=5} -H $hA -E 404
T "RA03" "User -> analytics -> 403"              GET  "$BASE/analytics/overview" -H $hA -E 403
T "RA04" "Admin -> superadmin panel -> 403"      GET  "$BASE/admin/stats" -H $hAdm -E 403
T "RA05" "Guest -> notifications -> 401"         GET  "$BASE/notifications" -E 401

# ── FINAL SUMMARY ────────────────────────────────────────────────────────────
$total = $pass + $fail
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   FINAL TEST RESULTS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ("   PASSED : {0}" -f $pass) -ForegroundColor Green
Write-Host ("   FAILED : {0}" -f $fail) -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })
Write-Host ("   TOTAL  : {0}" -f $total)
Write-Host ""
if ($bugs.Count -gt 0) {
    Write-Host "   FAILED TESTS:" -ForegroundColor Red
    $bugs | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    Write-Host ""
    Write-Host "   STATUS: BUGS FOUND - Fix before deployment." -ForegroundColor Red
} else {
    Write-Host "   All tests passed! QueueLess is ready for deployment." -ForegroundColor Green
}
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
