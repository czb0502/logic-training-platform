# 逻辑思维训练平台 - Windows服务卸载脚本
# 以管理员身份运行PowerShell执行此脚本

# 检查是否以管理员身份运行
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "请以管理员身份运行此脚本！" -ForegroundColor Red
    pause
    exit
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  逻辑思维训练平台 - 服务卸载" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 停止并删除服务
$services = @('LogicTraining Backend', 'LogicTraining Frontend')

foreach ($svcName in $services) {
    $svc = Get-Service -Name $svcName -ErrorAction SilentlyContinue
    if ($svc) {
        Write-Host "正在停止服务: $svcName..." -ForegroundColor Yellow
        Stop-Service $svcName -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
        
        Write-Host "正在删除服务: $svcName..." -ForegroundColor Yellow
        sc.exe delete $svcName | Out-Null
        Write-Host "  ✓ 已删除" -ForegroundColor Green
    } else {
        Write-Host "服务不存在: $svcName" -ForegroundColor Gray
    }
}

# 删除防火墙规则
Write-Host ""
Write-Host "删除防火墙规则..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "LogicTraining Backend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "LogicTraining Frontend" -ErrorAction SilentlyContinue
Write-Host "  ✓ 防火墙规则已删除" -ForegroundColor Green

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  服务卸载完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
pause