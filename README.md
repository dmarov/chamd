# Chamd (stands for "Chameleon DBK64")

## Modified Cheat Engine DBK64 kernel driver

### The purpose of this project is to enable usage of Cheat Engine kernel mode driver `DBK64.sys` on anti-cheat protected system.

It was tested using

- [EAC](https://www.easy.ac/en-us/partners/)
- [BattlEye](https://www.battleye.com/)

It could also work with a lot of other anti-cheats, but it's up to you to figure
it out.

Current version is based on Cheat Engine version 7.4

![screen](images/screen.png "Screen")
It works! *Robocraft* is EAC protected

## 0. Disclaimer

Even if you've managed to use this driver successfully it doesn't mean you will
not be suspected in cheating. Using this software or following instructions from
this document and all the consequences of it are totally on you.

## 1. Get your driver

There are some options for you to get this driver.

1.1. Download the precompiled version [here](https://github.com/dmarov/chamd/releases/download/v1.3/multibuild.zip).

This option is perfect for you if you'd like to start fast.
However this option is not recommended because there is probability
that publicly awailable driver was already flagged by anti-cheat system.
Anti-cheat systems collect suspicious drivers' signature to block them.
One way this could work is when particular driver gets used by few users.
Of course there's more to anti-cheat systems.
But there's no reason to worry about it yet.
Zip archive has 1000 drivers, you can pick any. Then go to section 3.

1.2. Follow the instructions in section 2 (recommended).

1.3. Follow instructions from section 2, but use
[EV certificate](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-cert-manage)
to sign driver. You could skip digital signature enforcement bypass this way. It's not cheap though
and certificate can be revoked.

## 2. Compile the driver from source (recommended)

Note: use PowerShell or [Cmder](https://cmder.app/)

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
(Windows Driver Kit)
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

2.12. If you've managed to compile this driver successfully and want to share few
randomized copies then run `npm run multibuild 10`. `dist` directory will
contain `10` randomized drivers.

Then go to section 3.

## 3. Load the driver

Now you have driver signed with untrusted certificate.
You have a few options to load it:

3.1. enable test signing

```shell
bcdedit /set testsigning on
```

System needs reboot in order for this command to take effect.

Then go to section 4.

This option won't work with anticheat, obviously, but is very useful if you just
want to test driver loading. Don't forget to disable it when you're done testing.

```shell
bcdedit /set testsigning off
```

3.2. use [EFIGuard](https://github.com/Mattiwatti/EfiGuard) to load unsigned drivers (recommended).

Please note that using this option ENDANGERS YOUR SYSTEM TO VULNERABILITIES!!!

- [Video tutorial 1](https://www.youtube.com/watch?v=EJGuJp2fqpM)
- [Video tutorial 2](https://www.youtube.com/watch?v=zsw3xoG3zgs)

3.2.1. Create bootable usb drive for digital signature enforcement bypass.

3.2.1.1. Download and extract [archive](https://github.com/Mattiwatti/EfiGuard/releases/download/v1.2.1/EfiGuard-v1.2.1.zip).

3.2.1.2. Mount you usb drive. 2GB drive is more than enough.

3.2.1.3. Format your usb drive as `FAT32`. BE CAREFULL TO FORMAT CORRECT DEVICE!!!

3.2.1.4. Partition your device as bootable `GPT` with `EFI` partition.
BE CAREFULL TO PARTITION CORRECT DEVICE!!!

Open command prompt as administrator.

```shell
diskpart
list disk // detect your USB drive
select disk {put number of your USB drive here} // SELECTING CORRECT DISK!!!
list disk // make sure correct disk is selected
clean // wipe out your drive
create partition primary size=512 // create EFI partition
list partitions // created partition shoud be displayed
select partition 1 // select created partition
active // mark partition as active
format quick fs=fat32 // create filesystem
assign // disk should be mounted
exit
```

3.2.1.5. Copy files to USB drive

Copy `EFI` directory from archive to the root of your newly created partition.

3.2.1.6. Rename bootloader

Copy and paste `EFI\Boot\Loader.efi`, than rename it to `EFI\Boot\bootx64.efi`.

3.2.2. Boot up your system using USB drive.

It is recommended first that you try it on virtual machine

- Virtualbox
- HyperV
- VMplayer

But if you feel lucky then set up your UEFI to boot from USB drive as first option,
second option should be your Windows drive.

Then go to section 4.

3.3. use [DSEFix](https://github.com/hfiref0x/DSEFix)

It should work, but it's not recommended in favor of option 3.2.

Please note that THIS METHOD IS DEPRECATED AND CAN CAUSE OCCASIONAL 'BLUE SCREENS OF DEATH'.

## 4. Copy files for digital signature enforcement bypass

4.1. Create `run.bat` in the directory where `cheatengine-x86_64.exe` located

```shell
"%~dp0\EfiDSEFix.exe" -d
start /d "%~dp0" cheatengine-x86_64.exe
timeout /t 20
"%~dp0\EfiDSEFix.exe" -e
```

4.2. Copy `EfiDSEFix.exe` to the directory where `cheatengine-x86_64.exe` located.

Then go to section 5.

## 5. Configure Cheat Engine

Make sure that

`Edit` > `Settings` > `Extra` > `Query memory region routines` is checked

`Edit` > `Settings` > `Extra` > `Read/Write process memory` is checked

Click `OK`.

It might end up with errors. Close Cheat Engine.

## 6. Run Cheat Engine after disabling digital signature enforcement.

Run `run.bat` as Administrator.

Do not close popped out window manually!!! Wait for it to close itself.

Once driver was loaded into memory it's enough to run `cheatengine-x86_64.exe` instead of `run.bat`.

## 7. Congratulations

Now you have loaded DBK64 driver signed with untrusted certificate.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 05/15/2022).
