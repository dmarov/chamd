# Chamd (Chameleon DBK64)

## Modified Driver Based on Cheat Engine DBK64

This project provides a modified version of the Cheat Engine DBK64 kernel driver aimed at bypassing detection by anti-cheat systems. It has been tested with EAC and BattlEye, potentially working with other systems as well.

Current version is based on Cheat Engine version 7.5

![screen](images/screen.png "Screen")
It works! *Robocraft* is EAC protected

## 0. Important Warning

Even if you've managed to use this driver successfully it doesn't mean you will
not be suspected in cheating. Usage of this software or following instructions from
this document and all the consequences of it are totally on you.

Also please note that following these instructions **ENDANGERS YOUR SYSTEM TO VULNERABILITIES**.
In general it is a good idea to use isolated PC for using such software. Also local network isolation might improve security.

## 1. Prepare your system
- Make sure you use **Windows 11**. Windows 10 won't work.
- Disable **Virus and Threat protection** in Windows settings, as well as other anti-virus software, because it will hinder download of required files.
- Install [Cheat Engine 7.5](https://github.com/cheat-engine/cheat-engine/releases/tag/7.5).

## 2. Get your driver

Download the [compiled driver](https://github.com/dmarov/chamd/releases/tag/v1.4) multibuild file.

The archive contains 1000+ drivers. Pick any of them. Copy all 3 files from archive to directory where `cheatengine-x86_64.exe` is located.

The reason behind that amount of drivers is that it prevents the same driver to be used by multiple users.
Using a unique driver increases the likelihood of avoiding detection.

The way anti-cheat works, is that it develops signatures for popular cheats and flags it in the database. Of cousre there's more to anti-cheat.

For better reliability, consider compiling your own driver following the instructions in Section 7. This process creates a custom driver tailored to your system, reducing the chances of
detection.


## 3. Bypass *Digital Singature Enforcement*

Now you have driver signed with untrusted certificate.
You have a few options to load it.
In this section the method involving bypass of *Patchguard* and *Digital Signature Enforcement* will be explained.
Refer to section 8 for some extra method.

- [Video tutorial 1](https://www.youtube.com/watch?v=EJGuJp2fqpM)
- [Video tutorial 2](https://www.youtube.com/watch?v=zsw3xoG3zgs)


3.1. Create bootable usb drive for digital signature enforcement bypass.

3.1.1. Download and extract [archive](https://github.com/Mattiwatti/EfiGuard/releases/download/v1.4/EfiGuard-v1.4.zip).

3.1.2. Mount you usb drive. 2GB drive is more than enough.

3.1.3. Format your usb drive as `FAT32`. BE CAREFULL TO FORMAT CORRECT DEVICE!!!

3.1.4. Partition your device as bootable `GPT` with `EFI` partition.
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

3.1.5. Copy files to USB drive

Copy `EFI` directory from archive to the root of your newly created partition.

3.1.6. Rename bootloader

Copy and paste `EFI\Boot\Loader.efi`, than rename it to `EFI\Boot\bootx64.efi`.

3.2. Boot up your system using USB drive.

Set up your UEFI to boot from USB drive as first option,
second option should be your Windows drive. Also don't forget to disable *Secure Boot*
since *EFIGuard* is not signed.

3.3. Copy files for digital signature enforcement bypass

3.3.1. Create `run.bat` in the directory where `cheatengine-x86_64.exe` located

```shell
"%~dp0\EfiDSEFix.exe" -d
start /d "%~dp0" cheatengine-x86_64.exe
timeout /t 20
"%~dp0\EfiDSEFix.exe" -e
```

3.3.2. Copy `EfiDSEFix.exe` from the archive  to the directory where `cheatengine-x86_64.exe` located.

## 4. Configure Cheat Engine

Make sure that

`Edit` > `Settings` > `Extra` > `Query memory region routines` is checked

`Edit` > `Settings` > `Extra` > `Read/Write process memory` is checked

Click `OK`.

It might end up with errors. Close Cheat Engine.

## 5. Run Cheat Engine.

### If you followed section 2:

Run `run.bat` as Administrator.

Do not close popped out window manually!!! Wait for it to close itself.

Once driver was loaded into memory it's enough to run `cheatengine-x86_64.exe` instead of `run.bat`.

### If you followed section 7:

Run `cheatengine-x86_64.exe`

## 6. Congratulations

Now you have loaded DBK64 driver signed with untrusted certificate.
Kernel mode anticheat will allow to start game and make operations on game memory
(last tested on EAC 19/04/2025).

## 7. [Extra] Compile the driver from source (recommended)

Anti-cheat systems collect suspicious drivers' signature to block them.
One way this could work is when particular driver gets used by few users (of course there's more to anti-cheat systems).
To address this issue it's recommended to compile you own version of driver with unique signature.

Note: use PowerShell or [Cmder](https://cmder.app/)

[Video Tutorial](https://www.youtube.com/watch?v=7ARwpxZPpE8)

7.1. Clone this repository

```shell
git clone https://github.com/dmarov/chamd.git
cd chamd
```

7.2. Install [nodejs](https://nodejs.org/en/). Version `19.1.0` is recommended.

7.3. Install packages

```shell
npm install
```

7.4. Copy `.env.tpl` to `.env`

7.5. Optionaly you may set `CHAMD_DBK_DRIVER_NAME` in `.env` to whatever name you wish.

7.6. Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)
(community or enterprise). This project is based on **Visual Studio 2022**.

7.7. Install **MSVC v143** (C/C++ compiler). You can install it by adding the Visual Studio
additional package `Desktop development with C++`.

7.8. Install [Windows SDK and WDK](https://docs.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)
Carefully follow the instructions from the link. It is important that SDK and WDK have the same version.
Correct versions of spectre mitigated libraries should be installed in the process.

7.9. Install openssl. The least complex way is to use Chocolatey.

```shell
choco install openssl
```

This command needs to be performed as admin

7.10. Run build

```shell
npm run all
```

Note:

You can use [EV certificate](https://learn.microsoft.com/en-us/windows-hardware/drivers/dashboard/code-signing-cert-manage)
to sign driver. You could skip digital signature enforcement bypass this way. It's not cheap though
and certificate can be revoked.

7.11. Copy all 3 files from 'dist' directory to directory where `cheatengine-x86_64.exe`
is located.

You'll need to use [Cheat Engine 7.4](https://github.com/cheat-engine/cheat-engine/releases/tag/7.4).

7.12. If you've managed to compile this driver successfully and want to share few
randomized copies then run `npm run multibuild 10`. `dist` directory will
contain `10` randomized drivers.

Then go to section 3.

## 8. Extra method of dealing with *Digital Signature Enforcement*

Open command prompt as Administrator

```shell
bcdedit /set testsigning on
```

System needs reboot in order for this command to take effect.

Then go to section 4.

Note:

This option won't work with anticheat, obviously, but is very useful if you just
want to test driver loading. Don't forget to disable it when you're done testing.

```shell
bcdedit /set testsigning off
```
