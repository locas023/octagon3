# Docker на этом ПК

16 ноября 2026: скачан официальный установщик с desktop.docker.com, проверена действительная подпись Docker Inc. Docker Desktop 4.99 установлен для текущего пользователя. Docker CLI и Compose отвечают; `docker compose config --quiet` для проекта проходит.

Включены Windows-компоненты VirtualMachinePlatform и Microsoft-Windows-Subsystem-Linux с NoRestart. Windows запросила перезагрузку. По Win32_Processor аппаратная виртуализация выключена; HypervisorPresent=False.

## Следующий шаг

1. Сохранить работу и перезагрузить ПК.
2. В BIOS/UEFI включить SVM Mode (AMD virtualization). Название и расположение зависят от платы. Сохранить настройки.
3. После загрузки открыть Docker Desktop. При необходимости выполнить обновление WSL по его подсказке.
4. Проверить `docker info`, затем запускать Compose проекта. Контейнерный запуск пока не проверен.

Windows 11 Pro 22H2, build 22621 ниже актуальных официальных требований Docker Desktop (Windows 11 23H2/build 22631 или новее). Установщик установился, но для поддерживаемой конфигурации нужно обновление Windows через Центр обновления.

Документация: https://docs.docker.com/desktop/setup/install/windows-install/

Локальный установщик: `%TEMP%\DockerDesktopInstaller.exe`. Docker Desktop: `%LOCALAPPDATA%\Programs\DockerDesktop\Docker Desktop.exe`.
