# =============================================================
# EduRoom - Script de Backup de Base de Datos
# =============================================================
# Uso: .\scripts\backup.ps1
#      .\scripts\backup.ps1 -DbUser "root" -DbPass "1234"
# Ejecutar desde la raiz del proyecto EduRoom
# =============================================================

param(
    [string]$DbUser       = "root",
    [string]$DbPass       = "1234",
    [string]$DbName       = "eduroom_db",
    [string]$MysqldumpPath = "C:\Program Files\MariaDB 12.2\bin\mysqldump.exe"
)

$timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir    = Split-Path -Parent $scriptDir
$backupDir  = Join-Path $rootDir "backups"
$backupFile = Join-Path $backupDir "backup_${DbName}_${timestamp}.sql"

# Crear directorio de backups si no existe
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host ""
Write-Host "========================================"
Write-Host "  EduRoom - Backup de Base de Datos"
Write-Host "========================================"
Write-Host "  Base de datos : $DbName"
Write-Host "  Destino       : $backupFile"
Write-Host "  Fecha/Hora    : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
Write-Host "========================================"

# Verificar que mysqldump existe
if (-not (Test-Path $MysqldumpPath)) {
    Write-Host "[ERROR] No se encuentra mysqldump en: $MysqldumpPath"
    Write-Host "        Ajusta el parametro -MysqldumpPath con la ruta correcta."
    exit 1
}

# Ejecutar backup
& $MysqldumpPath `
    -u $DbUser `
    -p$DbPass `
    --databases $DbName `
    --single-transaction `
    --routines `
    --triggers `
    --add-drop-database `
    2>$null | Out-File $backupFile -Encoding UTF8

if ($LASTEXITCODE -eq 0) {
    $size = (Get-Item $backupFile).Length
    $sizeKB = [math]::Round($size / 1024, 1)
    Write-Host ""
    Write-Host "[OK] Backup generado correctamente."
    Write-Host "     Archivo : $backupFile"
    Write-Host "     Tamanyo : $sizeKB KB ($size bytes)"
    Write-Host ""
} else {
    Write-Host "[ERROR] Fallo al generar el backup. Codigo de salida: $LASTEXITCODE"
    Write-Host "        Comprueba que el servidor MariaDB esta en ejecucion y las credenciales son correctas."
    exit 1
}
