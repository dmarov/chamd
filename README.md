# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver

The purpose of this driver is to not get detected by anti-cheat systems.

Current version is based on Cheat Engine version 7.4

## Disclaimer

Even if you've managed to use this driver successfully it doesn't mean you will
not be suspected in cheating. Using this software and all the consequences of it
are totally on you.

## Download the compiled driver

You can download the precompiled version [here](https://github.com/dmarov/chamd/releases).
This is not recommended because the driver could be flagged by the anticheat given
that anticheat systems collect suspicious drivers's signature to block them.
There is collection of [200 drivers](https://github.com/dmarov/chamd/releases/download/v1.3/multibuild.zip).
As a starting point you can pick any.

## Compile the driver from source (recommended)

It is recommended to compile the driver from the source code.

Note: use PowerShell or Cmder

[Video Tutorial](https://www.youtube.com/watch?v=7ARwpxZPpE8)

1. Clone this repository

    ```shell
    git clone https://github.com/dmarov/chamd.git
    cd chamd
    ```

2. Install [nodejs](https://nodejs.org/en/). Version `16.13.2` is recommended.
Version greater than `14.14.0` is required.

3. Install packages

    ```shell
    npm install
    ```

4. Copy `.env.tpl` to `.env`

5. You may set `CHAMD_DBK_DRIVER_NAME` in `.env` to whatever name you wish. For example you can use the CheatEngine default driver name `DBK64`.

6. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise). This project is based on Visual Studio 2019.

7. Install MSVC (C/C++ compiler). You can install it by adding the Visual Studio additional package `Desktop development with C++`.

8. Also you'll need to install [WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
(Windows Driver Development Kit)
(follow the instructions).

9. Install openssl. The least complex way is to use Chocolatey.
    ```
    choco install openssl
    ```
    This command needs to be performed as admin

10. Run build

    ```shell
    npm run all
    ```

11. Copy all 4 files from 'dist' directory to directory where `cheatengine-x86_64.exe` is located.

You'll need to use Cheat Engine version 7.4. Compile it from source (Release x64)
or get it from [here](https://github.com/dmarov/cheat-engine/releases/tag/7.4)

12. If you compiled this driver successfully and want to share few randomized copies
then run `npm run multibuild 10`. `dist` directory will contain `10` randomized drivers.

## Load the driver

Now you have test signed driver.
To load it you'll need to:

- enable test signing

    ```shell
    bcdedit /set testsigning on
    ```

    (this won't work with anticheat, obviously).

or

- (recommended) use [EFIGuard](https://github.com/Mattiwatti/EfiGuard) to load unsigned drivers.

    - [Video tutorial 1](https://www.youtube.com/watch?v=EJGuJp2fqpM)
    - [Video tutorial 2](https://www.youtube.com/watch?v=zsw3xoG3zgs)

Now you have loaded DBK64 driver signed using test certificate.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 05/15/2022).
