# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver, which supposed to be undetectable

Based on Cheat Engine version 7.2

Install git

clone this repository

```
git clone https://github.com/dmarov/chamd.git
cd chamd
```

Install nodejs via [https://nodejs.org/en/](NodeJS) or via NVM or via `chocolatey`
package manager.

install yarn from CLI
```
npm install yarn
```

install packages
```
yarn
```

Copy `.env.tpl` to `.env`

Fill in variables in `.env`:

set `CHAMD_DBK_DRIVER_NAME` to whatewer name you wish

Install visual studio (community or enterprise)
[https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16](Visual Studio).
You need to install MSVC (C/C++ compiler).
Also you'll need to install WDK (Windows Driver Development Kit)
[https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk](WDK)
(follow the instructions).

Install cmake from here [https://cmake.org/download/](CMake) or via `chocolatey`.

run build
```
yarn all
```

Copy all 4 files from 'dist' directory to directory where `cheatengine.exe` located
You'll need to use Cheat Engine version 7.2. Compile it from source (Release x64)

Now you have test signed driver.
To load it you'll need eigther enable test signing

```
bcdedit /set testsigning on
```
(this won't work with anticheat, obviously).

or use DSEFix
```
.\dsefix.exe
// now run cheatengine (don't forget to check everythjing in Settings -> Extra)
.\dsefix.exe -e
```

Now you have loaded unsigned DBK64 driver.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 07/20/2021).
