# =============================================================
# EduRoom - Script de Restauracion de Base de Datos
# =============================================================
# Uso: .\scripts\restore.ps1 -BackupFile ".\backups\backup_eduroom_XXXXXXXX.sql"
# Ejecutar desde la raiz del proyecto EduRoom
# ATENCION: Este script borra y recrea la BD desde el backup.
# =============================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$DbUser    = "root",
    [string]$DbPass    = "1234",
    [string]$MysqlPath = "C:\Program Files\MariaDB 12.2\bin\mysql.exe"
)

Write-Host ""
Write-Host "========================================"
Write-Host "  EduRoom - Restauracion de Base de Datos"
Write-Host "========================================"
Write-Host "  Archivo backup : $BackupFile"
Write-Host "  Usuario BD     : $DbUser"
Write-Host "  Fecha/Hora     : $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
Write-Host "========================================"
Write-Host ""

# Verificar que el archivo de backup existe
if (-not (Test-Path $BackupFile)) {
    Write-Host "[ERROR] No se encuentra el archivo de backup: $BackupFile"
    Write-Host "        Comprueba la ruta e intentalo de nuevo."
    exit 1
}

# Verificar que mysql existe
if (-not (Test-Path $MysqlPath)) {
    Write-Host "[ERROR] No se encuentra mysql en: $MysqlPath"
    Write-Host "        Ajusta el parametro -MysqlPath con la ruta correcta."
    exit 1
}

$sizeKB = [math]::Round((Get-Item $BackupFile).Length / 1024, 1)
Write-Host "[INFO] Archivo de backup: $sizeKB KB"
Write-Host "[INFO] Iniciando restauracion... (esto puede tardar unos segundos)"
Write-Host ""

# Confirmacion de seguridad
$confirm = Read-Host "  >> Esta accion BORRARA la base de datos actual y la restaurara desde el backup. Continuar? [S/N]"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "[CANCELADO] Restauracion cancelada por el usuario."
    exit 0
}

Write-Host ""
Write-Host "[INFO] Ejecutando restauracion..."

# Ejecutar restauracion
Get-Content $BackupFile | & $MysqlPath -u $DbUser -p$DbPass

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] Restauracion completada correctamente."
    Write-Host "     La base de datos 'eduroom_db' ha sido restaurada desde el backup."
    Write-Host ""
    Write-Host "     SIGUIENTE PASO: Reinicia el backend Spring Boot para reconectar."
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERROR] Fallo en la restauracion. Codigo de salida: $LASTEXITCODE"
    Write-Host "        Comprueba que el servidor MariaDB esta en ejecucion y las credenciales son correctas."
    exit 1
}
