# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver

The purpose of this project is to use Cheat Engine DBK64.sys driver on anti-cheat
protected systems such as EAC, BattlEye and probably a lot of other anti-cheats.

Current version is based on Cheat Engine version 7.4

![screen](images/screen.png "Screen")
*Robocraft* is EAC protected

## 0. Disclaimer

Even if you've managed to use this driver successfully it doesn't mean you will
not be suspected in cheating. Using this software or following instructions from
this document and all the consequences of it are totally on you.

## 1. Get your driver

There are some options for you to get this driver from easiest to hardest.

1.1. Download the precompiled version [here](https://github.com/dmarov/chamd/releases/download/v1.3/multibuild.zip).

This option is perfect for you if you'd like to start fast.
However it is not recommended because there's more probability that the driver
could be flagged by the anti-cheat system.
Anti-cheat systems collect suspicious drivers's signature to block them
(of course there's more to anti-cheat system).
Zip archive has 200 drivers, you can pick any. Then go to section 3.

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

2.5. You may set `CHAMD_DBK_DRIVER_NAME` in `.env` to whatever name you wish.
Just use your I-M-A-G-I-N-A-T-I-O-N.

2.6. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise). This project is based on Visual Studio 2019.

2.7. Install MSVC (C/C++ compiler). You can install it by adding the Visual Studio
additional package `Desktop development with C++`.

2.8. Also you'll need to install [WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
(Windows Driver Development Kit)
Follow the instructions from the link.

2.9. Install openssl. The least complex way is to use Chocolatey.

```shell
choco install openssl
```

This command needs to be performed as admin

2.10. Run build

```shell
npm run all
```

2.11. Copy all 4 files from 'dist' directory to directory where `cheatengine-x86_64.exe`
is located.

You'll need to use Cheat Engine version 7.4. Compile it from source (Release x64)
or get it from [here](https://github.com/dmarov/cheat-engine/releases/tag/7.4)

2.12. If you compiled this driver successfully and want to share few randomized copies
then run `npm run multibuild 10`. `dist` directory will contain `10` randomized drivers.

## 3. Load the driver

Now you have driver signed with untrusted certificate.
You have a few options to load it:

3.1 enable test signing

```shell
bcdedit /set testsigning on
```

this option won't work with anticheat, obviously, but is very useful if you just
want to test driver loading. Don't forget to disable it when you're done testing.

```shell
bcdedit /set testsigning off
```

3.2. use [EFIGuard](https://github.com/Mattiwatti/EfiGuard) to load unsigned drivers.

This option is recommended. ALSO IT ENDANGERS YOUR SYSTEM TO VULNERABILITIES!!!

- [Video tutorial 1](https://www.youtube.com/watch?v=EJGuJp2fqpM)
- [Video tutorial 2](https://www.youtube.com/watch?v=zsw3xoG3zgs)

3.2.1. Create bootable usb drive for Patchguard bypass.

3.2.1.1. Download and extract [archive](https://github.com/Mattiwatti/EfiGuard/releases/download/v1.2.1/EfiGuard-v1.2.1.zip).

3.2.1.2. Mount you usb drive. 2GB drive is more than enough.

3.2.1.3. Format your usb drive as `FAT32`. BE CAREFULL TO FORMAT CORRECT DEVICE!!!

3.2.1.4. Partition your device as bootable `GPT` with `EFI` partition.
BE CAREFULL TO PARTITION CORRECT DEVICE!!!

Open command prompt as administrator.

```shell
diskpart
list disk // detect your USB drive
select disk {put number of your USB drive here}
list disk // make sure correct disk is selected
clean // wipe out your drive
create partition primary // create EFI partition
list partitions // created partition shoud be displayed
select partition 1 // select created partition
active // mark partition as active
format quick fs=fat32 // create filesystem
assign // disk should be mounted
exit
```

3.2.1.5 Copy files to USB drive

Copy `EFI` directory from archive to the root of your newly created partition.

3.2.1.6 Rename bootloader

Copy and paste `EFI\Boot\Loader.efi`, than rename it to `EFI\Boot\bootx64.efi`.

3.2.2. Boot up your system using USB drive.

It is recommended first that you try it on virtual machine

- Virtualbox
- HyperV
- VMplayer

Any option is possible to implement.

But if you feel lucky then set up your EFI to boot from USB drive as first option,
second option should be your Windows drive.

## 4. Copy files for Patchguard bypass.

4.1. Create run.bat in the directory where `cheatengine-x86_64.exe` located

```shell
"%~dp0\EfiDSEFix.exe" -d
start /d "%~dp0" cheatengine-x86_64.exe
timeout /t 20
"%~dp0\EfiDSEFix.exe" -e
```

4.2. Copy `EfiDSEFix.exe` to the directory where `cheatengine-x86_64.exe` located.

## 5. Configure Cheat Engine

5.1. Make sure that

`Edit` > `Settings` > `Extra` > `Query memory region routines` is checked

`Edit` > `Settings` > `Extra` > `Read/Write process memory` is checked

Click `OK`.

It might end up with errors. Close Cheat Engine.

5.2. Run Cheat Engine after disabling Patchguard

Run `run.bat` as Administrator.

Dot not close popped out window manually!!! Wait for it to close itself.

## 6. Congratulations

Now you have loaded DBK64 driver signed using test certificate.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 05/15/2022).
