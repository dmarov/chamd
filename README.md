# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver, which supposed to be undetectable

Based on Cheat Engine version 7.3

You can download precompiled version [here](https://github.com/dmarov/chamd/releases)

Also you can compile it from source:
1. clone this repository

```
git clone https://github.com/dmarov/chamd.git
cd chamd
```

2. Install [nodejs](https://nodejs.org/en/)

3. install yarn
```
npm install yarn
```

4. install packages
```
yarn
```

5. Copy `.env.tpl` to `.env`

6. Fill in variables in `.env`:
set `CHAMD_DBK_DRIVER_NAME` to whatewer name you wish

7. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise).
You need to install MSVC (C/C++ compiler).

8. Also you'll need to install [WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
(Windows Driver Development Kit)
(follow the instructions).

9. run build
```
yarn all
```
Press "None" when asked.

10. Copy all 4 files from 'dist' directory to directory where `cheatengine.exe` located
You'll need to use Cheat Engine version 7.3. Compile it from source (Release x64)
or get it from [here](https://github.com/dmarov/cheat-engine/releases/tag/v7.3)

Now you have test signed driver.
To load it you'll need eigther enable test signing

```
bcdedit /set testsigning on
```
(this won't work with anticheat, obviously).

or you can use
[EFIGuard](https://github.com/Mattiwatti/EfiGuard) to load unsigned drivers.

Now you have loaded unsigned DBK64 driver.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 01/15/2022).


TODO:

Try to use [Code Virtualizer](https://www.oreans.com/CodeVirtualizer.php) when driver will be detected by EAC.

figure out if changing driver name even does anything
