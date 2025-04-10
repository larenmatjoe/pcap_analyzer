/*
  Network Traffic Analysis Rules
  These rules detect potentially suspicious or malicious patterns in network traffic
*/

rule HTTP_Basic_Auth
{
    meta:
        description = "Detect HTTP Basic Authentication credentials"
        author = "Security Analyst"
        severity = "medium"
    
    strings:
        $auth_header = "Authorization: Basic " nocase
    
    condition:
        $auth_header
}

rule FTP_Credentials
{
    meta:
        description = "Detect FTP usernames and passwords"
        author = "Security Analyst"
        severity = "medium"
    
    strings:
        $user_cmd = "USER " nocase
        $pass_cmd = "PASS " nocase
    
    condition:
        $user_cmd or $pass_cmd
}

rule SQL_Injection_Attempt
{
    meta:
        description = "Detect potential SQL injection attempts"
        author = "Security Analyst"
        severity = "high"
    
    strings:
        $sql1 = "' OR " nocase
        $sql2 = "' AND " nocase
        $sql3 = "1=1" nocase
        $sql4 = "UNION SELECT" nocase
        $sql5 = "DROP TABLE" nocase
        $sql6 = "EXEC xp_" nocase
        $sql7 = "'; --" nocase
    
    condition:
        any of them
}

rule Suspicious_PowerShell_Download
{
    meta:
        description = "Detect PowerShell download commands"
        author = "Security Analyst"
        severity = "high"
    
    strings:
        $dl1 = "Invoke-WebRequest" nocase
        $dl2 = "wget " nocase
        $dl3 = "curl " nocase
        $dl4 = "Net.WebClient" nocase
        $dl5 = "DownloadFile" nocase
        $dl6 = "DownloadString" nocase
    
    condition:
        any of them
}

rule Executable_File_Transfer
{
    meta:
        description = "Detect executable file transfers"
        author = "Security Analyst"
        severity = "medium"
    
    strings:
        $mz = "MZ"
        $exe = ".exe" nocase
        $dll = ".dll" nocase
        $bat = ".bat" nocase
        $ps1 = ".ps1" nocase
        $vbs = ".vbs" nocase
        $sh = ".sh" nocase
    
    condition:
        $mz or any of ($exe, $dll, $bat, $ps1, $vbs, $sh)
}

rule Command_and_Control_Patterns
{
    meta:
        description = "Detect common C2 communication patterns"
        author = "Security Analyst"
        severity = "high"
    
    strings:
        $beacon1 = /beac[o0]n/i
        $agent1 = /agent[_-]?id/i
        $checkin = /check[_-]?in/i
        $taskid = /task[_-]?id/i
        $cmd = /cmd[_-]?output/i
        $exfil = /data[_-]?exfil/i
    
    condition:
        any of them
}

rule Cleartext_Credentials
{
    meta:
        description = "Detect potential plaintext credentials"
        author = "Security Analyst"
        severity = "medium"
    
    strings:
        $password = /pass(word)?[\s]?[=:]/i
        $user = /user(name)?[\s]?[=:]/i
        $login = /login[\s]?[=:]/i
        $pwd = /pwd[\s]?[=:]/i
        $cred = /credential[\s]?[=:]/i
        $api_key = /api[_-]?key[\s]?[=:]/i
        $token = /token[\s]?[=:]/i
    
    condition:
        any of them
}

rule Suspicious_User_Agent
{
    meta:
        description = "Detect suspicious or uncommon user agents"
        author = "Security Analyst"
        severity = "medium"
    
    strings:
        $ua_header = "User-Agent: " nocase
        $ua_curl = "curl/" nocase
        $ua_wget = "Wget/" nocase
        $ua_powershell = "Mozilla/5.0 (Windows NT; Windows NT" nocase  // Default PowerShell UA
        $ua_empty = "User-Agent: -" nocase
        $ua_short = "User-Agent: a" nocase
        $ua_python = "python-requests" nocase
    
    condition:
        $ua_header and any of ($ua_curl, $ua_wget, $ua_powershell, $ua_empty, $ua_short, $ua_python)
}

rule DNS_Tunneling_Indicators
{
    meta:
        description = "Detect potential DNS tunneling"
        author = "Security Analyst"
        severity = "high"
    
    strings:
        $base64_subdomain = /[a-zA-Z0-9+\/=]{30,}\.[a-z0-9-]+\.[a-z]{2,}/i
        $hex_subdomain = /[0-9a-f]{30,}\.[a-z0-9-]+\.[a-z]{2,}/i
    
    condition:
        any of them
}

rule Potential_Data_Exfiltration
{
    meta:
        description = "Detect potential data exfiltration in HTTP requests"
        author = "Security Analyst"
        severity = "high"
    
    strings:
        $base64_data = /[a-zA-Z0-9+\/=]{100,}/
        $long_param = /[?&][a-z0-9_-]+=.{100,}/i
    
    condition:
        any of them
}

