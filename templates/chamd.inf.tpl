;
; {{DRIVER_NAME}}.inf
;

[Version]
Signature="$WINDOWS NT$"
Class=Sample ; TODO: edit Class
ClassGuid={78A1C341-4539-11d3-B88D-00C04FAD5171} ; TODO: edit ClassGuid
Provider=%ManufacturerName%
CatalogFile={{DRIVER_NAME}}.cat
DriverVer=
PnpLockDown=1

[DestinationDirs]
DefaultDestDir = 12
{{DRIVER_NAME}}_Device_CoInstaller_CopyFiles = 11

; ================= Class section =====================

[ClassInstall32]
Addreg=SampleClassReg

[SampleClassReg]
HKR,,,0,%ClassName%
HKR,,Icon,,-5

[SourceDisksNames]
1 = %DiskName%,,,""

[SourceDisksFiles]
{{DRIVER_NAME}}.sys  = 1,,
;WdfCoInstaller$KMDFCOINSTALLERVERSION$.dll=1 ; make sure the number matches with SourceDisksNames

;*****************************************
; Install Section
;*****************************************

[Manufacturer]
%ManufacturerName%=Standard,NT$ARCH$

[Standard.NT$ARCH$]
%{{DRIVER_NAME}}.DeviceDesc%={{DRIVER_NAME}}_Device, Root\\{{DRIVER_NAME}} ; TODO: edit hw-id

[{{DRIVER_NAME}}_Device.NT]
CopyFiles=Drivers_Dir

[Drivers_Dir]
{{DRIVER_NAME}}.sys

;-------------- Service installation
[{{DRIVER_NAME}}_Device.NT.Services]
AddService = {{DRIVER_NAME}},%SPSVCINST_ASSOCSERVICE%, {{DRIVER_NAME}}_Service_Inst

; -------------- {{DRIVER_NAME}} driver install sections
[{{DRIVER_NAME}}_Service_Inst]
DisplayName    = %{{DRIVER_NAME}}.SVCDESC%
ServiceType    = 1               ; SERVICE_KERNEL_DRIVER
StartType      = 3               ; SERVICE_DEMAND_START
ErrorControl   = 1               ; SERVICE_ERROR_NORMAL
ServiceBinary  = %12%\\{{DRIVER_NAME}}.sys

;
;--- {{DRIVER_NAME}}_Device Coinstaller installation ------
;

[{{DRIVER_NAME}}_Device.NT.CoInstallers]
AddReg={{DRIVER_NAME}}_Device_CoInstaller_AddReg
CopyFiles={{DRIVER_NAME}}_Device_CoInstaller_CopyFiles

[{{DRIVER_NAME}}_Device_CoInstaller_AddReg]
;HKR,,CoInstallers32,0x00010000, "WdfCoInstaller$KMDFCOINSTALLERVERSION$.dll,WdfCoInstaller"

[{{DRIVER_NAME}}_Device_CoInstaller_CopyFiles]
;WdfCoInstaller$KMDFCOINSTALLERVERSION$.dll

[{{DRIVER_NAME}}_Device.NT.Wdf]
KmdfService =  {{DRIVER_NAME}}, {{DRIVER_NAME}}_wdfsect
[{{DRIVER_NAME}}_wdfsect]
KmdfLibraryVersion = $KMDFVERSION$

[Strings]
SPSVCINST_ASSOCSERVICE= 0x00000002
ManufacturerName="{{DRIVER_NAME}} Inc."
ClassName="Samples" ; TODO: edit ClassName
DiskName = "{{DRIVER_NAME}} Installation Disk"
{{DRIVER_NAME}}.DeviceDesc = "{{DRIVER_NAME}} Device"
{{DRIVER_NAME}}.SVCDESC = "{{DRIVER_NAME}} Service"
