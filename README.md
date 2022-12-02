# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver

The purpose of this project is to use Cheat Engine DBK64.sys driver on anti-cheat
protected systems such as EAC, BattEye and probably a lot of other anti-cheats.

Current version is based on Cheat Engine version 7.4

## 0. Disclaimer

Even if you've managed to use this driver successfully it doesn't mean you will
not be suspected in cheating. Using this software and all the consequences of it
are totally on you.

## 1. Get your driver
There are some options for you to get this driver from easiest to hardest.

1.1. Download the precompiled version [here](https://github.com/dmarov/chamd/releases/download/v1.3/multibuild.zip).
Use this option if you would like to start fast.
However it is not recommended because the driver could be flagged by the anti-cheat system.
Anti-cheat systems collect suspicious drivers's signature to block them
(of course there's more to anti-cheat system).
Zip archive has 200 drivers, you can pick any.

1.2. Follow the instructions in section 2 (recommended).

## 2. Compile the driver from source

It is recommended to compile the driver from the source code.

Note: use PowerShell or Cmder

[Video Tutorial](https://www.youtube.com/watch?v=7ARwpxZPpE8)

2.1. Clone this repository

```shell
git clone https://github.com/dmarov/chamd.git
cd chamd
```

2.2. Install [nodejs](https://nodejs.org/en/). Version `19.1.0` is recommended.

2.3. Install packages

```shell
npm install
```

2.4. Copy `.env.tpl` to `.env`

2.5. You may set `CHAMD_DBK_DRIVER_NAME` in `.env` to whatever name you wish. For example you can use the CheatEngine default driver name `DBK64`.

2.6. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise). This project is based on Visual Studio 2019.

2.7. Install MSVC (C/C++ compiler). You can install it by adding the Visual Studio additional package `Desktop development with C++`.

2.8. Also you'll need to install [WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
(Windows Driver Development Kit)
(follow the instructions).

2.9. Install openssl. The least complex way is to use Chocolatey.
```
choco install openssl
```
This command needs to be performed as admin

2.10. Run build

```shell
npm run all
```

2.11. Copy all 4 files from 'dist' directory to directory where `cheatengine-x86_64.exe` is located.

You'll need to use Cheat Engine version 7.4. Compile it from source (Release x64)
or get it from [here](https://github.com/dmarov/cheat-engine/releases/tag/7.4)

2.12. If you compiled this driver successfully and want to share few randomized copies
then run `npm run multibuild 10`. `dist` directory will contain `10` randomized drivers.

## 3. Load the driver

Now you have test signed driver.
To load it you'll need to:

3.1 enable test signing

```shell
bcdedit /set testsigning on
```

(this won't work with anticheat, obviously).

or

3.2 (recommended) use [EFIGuard](https://github.com/Mattiwatti/EfiGuard) to load unsigned drivers.

- [Video tutorial 1](https://www.youtube.com/watch?v=EJGuJp2fqpM)
- [Video tutorial 2](https://www.youtube.com/watch?v=zsw3xoG3zgs)

Now you have loaded DBK64 driver signed using test certificate.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 05/15/2022).
