# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver (undetectable)

This driver is supposed to be undetectable by the anticheat.

It is based on Cheat Engine version 7.3

## Download the compiled driver

You can download the precompiled version [here](https://github.com/dmarov/chamd/releases). This is not recommended because the driver could be flagged by the anticheat given that anticheat systems collect suspicious drivers's signature to block them.

## Compile the driver from source (recommended)

It is recommended to compile the driver from the source code.

Note: use PowerShell or Cmder

[Video Tutorial](https://www.youtube.com/watch?v=7ARwpxZPpE8)

1. Clone this repository

    ```shell
    git clone https://github.com/dmarov/chamd.git
    cd chamd
    ```

2. Install [nodejs](https://nodejs.org/en/)

3. Install yarn

    ```shell
    npm install -g yarn
    ```

4. Install packages

    ```shell
    yarn
    ```

5. Copy `.env.tpl` to `.env`

6. Fill in variables in `.env`. Set `CHAMD_DBK_DRIVER_NAME` to whatever name you wish. You can use the CheatEngine default driver name `DBK64`.

7. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise). This project is based on Visual Studio 2019.

8. Install MSVC (C/C++ compiler). You can install it by adding the Visual Studio additional package `Desktop development with C++`.

9. Also you'll need to install [WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
(Windows Driver Development Kit)
(follow the instructions).

10. Run build

    ```shell
    yarn all
    ```

    Press `None` when asked.

11. Copy all 4 files from 'dist' directory to directory where `cheatengine.exe` is located.

You'll need to use Cheat Engine version 7.3. Compile it from source (Release x64)
or get it from [here](https://github.com/dmarov/cheat-engine/releases/tag/v7.3_64bit)

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

    [Video tutorial](https://www.youtube.com/watch?v=EJGuJp2fqpM)

Now you have loaded unsigned DBK64 driver.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 01/15/2022).

## TODO

- Try to use [Code Virtualizer](https://www.oreans.com/CodeVirtualizer.php) when driver will be detected by EAC.

- Figure out if changing driver name even does anything
