# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver, which supposed to be undetectable

Based on Cheat Engine version 7.2

clone this repository

```
git clone https://github.com/dmarov/chamd.git
cd chamd
```

Install [nodejs](https://nodejs.org/en/)

install yarn
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

Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise).
You need to install MSVC (C/C++ compiler).
Also you'll need to install [WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
(Windows Driver Development Kit)

(follow the instructions).

run build
```
yarn all
```

Press "None" when asked.

Copy all 4 files from 'dist' directory to directory where `cheatengine.exe` located
You'll need to use Cheat Engine version 7.2. Compile it from source (Release x64)
or get it from [here](https://github.com/dmarov/cheat-engine/releases/tag/v7.2)

Now you have test signed driver.
To load it you'll need eigther enable test signing

```
bcdedit /set testsigning on
```
(this won't work with anticheat, obviously).

or use [DSEFix](https://github.com/hfiref0x/DSEFix)
```
.\dsefix.exe
// now run cheatengine (don't forget to check everythjing in Settings -> Extra)
.\dsefix.exe -e
```

Now you have loaded unsigned DBK64 driver.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 07/20/2021).


TODO:

Try to use [Code Virtualizer](https://www.oreans.com/CodeVirtualizer.php) when driver will be detected by EAC.

figure out if changing driver name even does anything
