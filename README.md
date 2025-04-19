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
not be suspected in cheating. Usage of this software or following instructions from
this document and all the consequences of it are totally on you.

Also please note that following these instructions ENDANGERS YOUR SYSTEM TO VULNERABILITIES in one way or the other.

## 1. Get your driver

You can download the precompiled version [here](https://github.com/dmarov/chamd/releases/download/v1.3/multibuild.zip).

Make sure you're using **Windows 11** and *Virus and Threat protection* is disabled in windows settings.

This option is perfect for you if you'd like to start fast.
However this option is not recommended because there is probability
that publicly available driver was already flagged by anti-cheat system.
For advanced setup refer to section 6. However it is not necessary at the moment,
because zip archive has 1000 drivers. You can pick any.

Copy all 4 files from archive to directory where `cheatengine-x86_64.exe`
is located.

You'll need to use [Cheat Engine 7.4](https://github.com/cheat-engine/cheat-engine/releases/tag/7.4).

## 2. Bypass *Digital Singature Enforcement*

Now you have driver signed with untrusted certificate.
You have a few options to load it.
In this section the method involving bypass of *Patchguard* and *Digital Signature Enforcement* will be explained.
Refer to section 7 for some extra methods.

- [Video tutorial 1](https://www.youtube.com/watch?v=EJGuJp2fqpM)
- [Video tutorial 2](https://www.youtube.com/watch?v=zsw3xoG3zgs)


2.1. Create bootable usb drive for digital signature enforcement bypass.

2.1.1. Download and extract [archive](https://github.com/Mattiwatti/EfiGuard/releases/download/v1.2.1/EfiGuard-v1.4.zip).

2.1.2. Mount you usb drive. 2GB drive is more than enough.

2.1.3. Format your usb drive as `FAT32`. BE CAREFULL TO FORMAT CORRECT DEVICE!!!

2.1.4. Partition your device as bootable `GPT` with `EFI` partition.
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

2.1.5. Copy files to USB drive

Copy `EFI` directory from archive to the root of your newly created partition.

2.1.6. Rename bootloader

Copy and paste `EFI\Boot\Loader.efi`, than rename it to `EFI\Boot\bootx64.efi`.

2.2. Boot up your system using USB drive.

Set up your UEFI to boot from USB drive as first option,
second option should be your Windows drive. Also don't forget to disable *Secure Boot*
since *EFIGuard* is not signed.

2.3. Copy files for digital signature enforcement bypass

2.3.1. Create `run.bat` in the directory where `cheatengine-x86_64.exe` located

```shell
"%~dp0\EfiDSEFix.exe" -d
start /d "%~dp0" cheatengine-x86_64.exe
timeout /t 20
"%~dp0\EfiDSEFix.exe" -e
```

2.3.2. Copy `EfiDSEFix.exe` from the archive  to the directory where `cheatengine-x86_64.exe` located.

## 3. Configure Cheat Engine

Make sure that

`Edit` > `Settings` > `Extra` > `Query memory region routines` is checked

`Edit` > `Settings` > `Extra` > `Read/Write process memory` is checked

Click `OK`.

It might end up with errors. Close Cheat Engine.

## 4. Run Cheat Engine.

### If you followed section 2:

Run `run.bat` as Administrator.

Do not close popped out window manually!!! Wait for it to close itself.

Once driver was loaded into memory it's enough to run `cheatengine-x86_64.exe` instead of `run.bat`.

### If you followed section 7:

Run `cheatengine-x86_64.exe`

## 5. Congratulations

Now you have loaded DBK64 driver signed with untrusted certificate.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 19/04/2025).

## 6. [Extra] Compile the driver from source (recommended)

Anti-cheat systems collect suspicious drivers' signature to block them.
One way this could work is when particular driver gets used by few users (of course there's more to anti-cheat systems).
To address this issue it's recommended to compile you own version of driver with unique signature.

Note: use PowerShell or [Cmder](https://cmder.app/)

[Video Tutorial](https://www.youtube.com/watch?v=7ARwpxZPpE8)

6.1. Clone this repository

```shell
git clone https://github.com/dmarov/chamd.git
cd chamd
```

6.2. Install [nodejs](https://nodejs.org/en/). Version `19.1.0` is recommended.

6.3. Install packages

```shell
npm install
```

6.4. Copy `.env.tpl` to `.env`

6.5. You may set `CHAMD_DBK_DRIVER_NAME` in `.env` to whatever name you wish.
Just use your I-M-A-G-I-N-A-T-I-O-N.

6.6. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise). This project is based on Visual Studio 2022.

6.7. Install MSVC (C/C++ compiler). You can install it by adding the Visual Studio
additional package `Desktop development with C++`.

6.8. Install [Windows SDK and WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
Carefully follow the instructions from the link

6.9. Install openssl. The least complex way is to use Chocolatey.

```shell
choco install openssl
```

This command needs to be performed as admin

6.10. Run build

```shell
npm run all
```

Note:

You can use [EV certificate](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-cert-manage)
to sign driver. You could skip digital signature enforcement bypass this way. It's not cheap though
and certificate can be revoked.

6.11. Copy all 4 files from 'dist' directory to directory where `cheatengine-x86_64.exe`
is located.

You'll need to use [Cheat Engine 7.4](https://github.com/cheat-engine/cheat-engine/releases/tag/7.4).

6.12. If you've managed to compile this driver successfully and want to share few
randomized copies then run `npm run multibuild 10`. `dist` directory will
contain `10` randomized drivers.

Then go to section 2.

## 7. [Extra] Other methods of dealing with *Digital Signature Enforcement*

### 7.1. enable test signing (recommended for testing purposes only)

Open command prompt as Administrator

```shell
bcdedit /set testsigning on
```

System needs reboot in order for this command to take effect.

Then go to section 3.

Note:

This option won't work with anticheat, obviously, but is very useful if you just
want to test driver loading. Don't forget to disable it when you're done testing.

```shell
bcdedit /set testsigning off
```

### 7.2. use [DSEFix](https://github.com/hfiref0x/DSEFix) (deprecated)

It should work, but it's not recommended in favor of method explained in section 2.

Please note that THIS METHOD IS DEPRECATED AND CAN CAUSE OCCASIONAL 'BLUE SCREENS OF DEATH'.

Then go to section 3.
