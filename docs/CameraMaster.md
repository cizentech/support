# CameraMaster

**CameraMaster User Manual**

The CameraMaster (software GUI) interacts directly with the MIG-S2 Grabber to control camera modules, configure serializers/deserializers, and capture image in real-time.

![스크린샷, 멀티미디어 소프트웨어, 텍스트, 그래픽 소프트웨어이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/432a52bc17e1873952d5be2ea0d40df1.png)

![전자기기이(가) 표시된 사진 자동 생성된 설명](media/86713b5ed13dbb048f35c9678f511289.png)

**Table of Contents**

1.  System Overview
2.  Configuration File Structure
    -   2.1 Grabber Configuration
    -   2.2 Power Configuration
    -   2.3 Deserializer Configuration
    -   2.4 Serializer Configuration
    -   2.5 Image Sensor / ISP Configuration
3.  Module Bring-up Procedure
    -   3.1 Required Information
    -   3.2 Bring-up Test Using CameraMaster
4.  Offline Test Mode
    -   4.1 Test Procedure
5.  Additional Menu Functions
6.  Grabber Terminal Usage
    -   6.1 Setting I2C Address
    -   6.2 Writing I2C Data
    -   6.3 Reading I2C Data
7.  Image Kit Content
    -   SFR
    -   Distortion
    -   Defect
    -   Stain (Blemish)
    -   Optical Center
    -   Shading (Vignetting)
    -   Fixed Pattern Noise
    -   Uniformity
8.  Driver Installation
9.  Appendix & Notes

## 1. System Overview

CameraMaster operates through a following data flow.

![텍스트, 스크린샷이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/ff60fa9b0cff9c3bbec0b7c2fc44b066.png)

-   **Configuration Data Flow (for settings):**  
    CameraMaster(PC USB) → S2 Board (I2C) → Deserializer (GMSL) → FAKRA Cable → Serializer (I2C) → Camera Module (I2C)
-   **Video Signal Flow (for image data):**  
    Camera Module (MIPI) → Serializer (GMSL) → FAKRA Cable → Deserializer (MIPI) → S2 Board(USB) → CameraMaster(PC)

## 2. Configuration File Structure

CameraMaster utilizes .ini files to configure sensor modules.

**2.1 Grabber Configuration**

![텍스트, 스크린샷, 폰트, 번호이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/d40396ba84d259d90cf42f26b398ce1f.png)

-   Image Format
-   Image Size
-   Default i2c format
-   Etc.

**2.2 Power Configuration**

-   Module Power Configuration

    ![텍스트, 폰트, 스크린샷, 화이트이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/8a476b8abb929eefc3459ba6bd8ded73.png)

**2.3 Deserializer Configuration**

-   GMSL Link Speed Configuration
-   Output MIPI Lane Configuration
-   Etc.

    ![텍스트, 스크린샷, 폰트, 번호이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/2b4cb29f3d52a2a1bc9ac4f899953c63.png)

**2.4 Serializer Configuration**

-   GMSL Link Speed Configuration
-   Input data type Configuration
-   Output GPIO Configuration
-   Etc.

    ![텍스트, 폰트, 화이트, 타이포그래피이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/e9f004a9204e384ea6080f7e3d17f691.png)

**2.5 Image Sensor / ISP Configuration**

-   Initial register settings for streaming.
-   Etc.

    ![텍스트, 폰트, 스크린샷, 화이트이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/1b9991215f47f6b9e2fb2a7a17b62950.png)

## 3. Module Bring-up Procedure

**3.1 Required Information**

**case 1. Image Sensor and SER initial is downloaded during module boot up**

**case 2. Image Sensor and SER initial is setup by host i2c command**

| **Required Information**         | **case 1 (boot)** | **case 2 (host)** |
|----------------------------------|-------------------|-------------------|
| **Image Format**                 | **O**             | **O**             |
| **Image Resolution**             | **O**             | **O**             |
| **Image Sensor initial setting** | **X**             | **O**             |
| **Serializer setting**           | **X**             | **O**             |
| **De-serializer setting**        | **O**             | **O**             |
| **PoC Power Voltage**            | **O**             | **O**             |

**3.2 Bring-up Test Using CameraMaster**

![텍스트, 스크린샷, 멀티미디어 소프트웨어, 소프트웨어이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/29dd477f5dfe574e70c9966cec7e6ac4.png)

1.  Select configuration file
2.  View configuration file contents
3.  Power ON camera module
4.  View live video
5.  Initialize sensor
6.  Power OFF
7.  Currently selected configuration file name
8.  Monitor frame status
9.  Monitor Grabber board connection

![텍스트, 스크린샷, 소프트웨어, 번호이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/a2b4c10ee189f5c0455ac220404c0809.png)

1.  Select Power On / Off
2.  Check Applied Voltage after Power On
3.  Check Current
4.  Select Sensor & SER & DES initial set
5.  Power Off when Sensor Init Fail
6.  Check Sensor PCLK and Horizontal and Vertical sync count

## 4. Offline Test Mode

**4.1 Test Procedure**

1.  Select configuration(ini) file
2.  Load image file
3.  Save image file
4.  Open ini in Notepad
5.  Open Inspection Option window
6.  Set Offline test mode (test without capturing)
7.  Proceed Test item.
8.  Open the Inspection Options Settings window for the corresponding item.

![텍스트, 스크린샷, 멀티미디어 소프트웨어, 소프트웨어이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/38ae081a284d63440119b92ac0ab894e.png)

## 5. Additional Menu Functions

![텍스트, 스크린샷, 소프트웨어, 디자인이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/8f01133d9eddf331d5db75f7da0afb76.png)

1.  Open report directory
2.  Open settings path
3.  Open item option file
4.  Access program folder

## 6. Grabber Terminal Usage

![텍스트, 전자제품, 스크린샷, 컴퓨터이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/395621af1870db11f2bcb38d7227b123.png)

**6.1 Setting I2C Address**

devadr x90 400 1 1

// Slave Address: x90

// I2C Speed: 400kHz

// 16-bit Register Address: Enabled

// 16-bit Register Data: Enabled

**6.2 Writing I2C Data**

x0000 x90

// Write value x90 to register x0000

**6.3 Reading I2C Data**

i2cr x0000

// Read 1 byte from x0000

i2cr x0000 4

// Read 4 bytes from x0000

## 7. Grabber Terminal command list

VER (Read current F/W H/W version)

DEVADR x90 400 10 (SlaveAddr [Speed] [WordIndex(0/1)] [WordValue(0/1)]/ Change CAM_I2C slave address)

I2CR xAABB 1 (RegAddr, NumOfRead / Read CAM_I2C Register)

I2CW xAABB x12 (RegAddr, Value / Write CAM_I2C Register)

DELAY 100 (delay time 100 milisec)

I2C32W xaabbccdd x12 (I2C 32bit Address and 1byte data write)

I2C32R xaabbccdd (I2C 32bit Address and read 1byte data)

GPIOR 1 (Pin_1 / read Value(high:1,low:0) / Read GPIO)

GPIOW 1 0 (Pin_1 low / set Value(high: 1,low:0) / Write GPIO)

PWR 1 10 (Channel_1 = 10 V / Channel:1\~ (if Zero, OV Forcesing) / Power ON the specified channel)

PWROFF 1 (Channel_1 off / Channel:1\~ / Power OFF the specified channel. without Param, off all channel)

MEASUREV 1 10 (Channel(1\~), Average Count(10) / Measure voltage)

MEASUREC 1 10 (Channel(1\~), Average Count(10) / Measure current)

BOARD_PRESET RESET (RESET: reset (set this before sensor initial), ENABLE: enable (set this after sensor initial) - for S2 board internal)

FPS (check Frame Per Second)

CHECKSYNC (Check image data sync count)

MIPI_VIRTUAL_CH_SEL 0 (select virtual channel 0, 1,,)

DES_INDEX_SEL 1 (1,2,3,,8 (or TI)(select DES Channel) - This only works on certain daughterboards.

FSYNC_AUTO_SET 1 30 (Periodic Frame Sync 0:Disable 1:Eanble / 1:1Hz, 30:30 Hz)

FSYNC_SINGLE (Single Frame Sync. 1pulse generate.it should disable FSYNC_AUTO_SET)

MSGBOX test1 (Popup message box)

BULK_MODE_START (Bulk Mode data Starting) – in bulk mode, all data (start\~end) will send to board first, after each data will be send to target.

BULK_MODE_END (Bulk Mode data Finishing)

## 8. CameraMaster installation

[installation program](https://cizentech-my.sharepoint.com/:u:/p/mason/EZeax6VV-1VKriBgZKDfdEwBMlDYa9pkRP8T6u_6m8a5zQ?e=BvJcAH)

![텍스트, 폰트, 스크린샷, 화이트이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/cb2674501edde05c227b3b47f1010b20.png)

![텍스트, 스크린샷, 소프트웨어, 컴퓨터 아이콘이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/d70c0900188d0fe97f8e4cce90236412.png)

![텍스트, 소프트웨어, 컴퓨터 아이콘, 컴퓨터이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/51073a2b57b2cc26743cc5388bd61317.png)

![텍스트, 스크린샷, 소프트웨어, 디스플레이이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/118b751cb4febb016e46db04cfbcd4ff.png)

![텍스트, 스크린샷, 소프트웨어, 디스플레이이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/9b758a8a6b80002c0f4c65c868cfd013.png)

![텍스트, 스크린샷, 컴퓨터, 소프트웨어이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/be15d278fb22a2ff89d53b84d4fafcba.png)

![텍스트, 스크린샷, 소프트웨어, 멀티미디어 소프트웨어이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/ffda57c75a0475daeafb775ab309007d.png)

## 9. Driver Installation

[Install the MIG_Driver_win10_x64 package](https://cizentech-my.sharepoint.com/:u:/p/mason/Ed_I9q-3fPpAj6ca6SkHVgQBklY5Z7CpYuXBG8GC3qJv5g?e=32tdgL)

[Install the MIG_Driver_Signed_win10_x64 package](https://cizentech-my.sharepoint.com/:u:/p/mason/EVryLOTvBRBJhrQF8aKAbaQBKpjr-BKYtnMeJWi-xjI3uw?e=tfwECH)

![텍스트, 폰트, 스크린샷이(가) 표시된 사진 자동 생성된 설명](media/24f7ac826006a1f50233abfc07da21e9.png)

![텍스트, 스크린샷, 폰트, 라인이(가) 표시된 사진 자동 생성된 설명](media/d510c68c255d79152026d3434cc52ab7.png)

![텍스트, 스크린샷, 폰트이(가) 표시된 사진 자동 생성된 설명](media/5295c0e89f0e336cad77bca047164ef3.png)

![텍스트, 폰트, 스크린샷이(가) 표시된 사진 자동 생성된 설명](media/8e6e2c8dc87bcada269f9d8f3a5d8b76.png)

## 10. Trouble shoot

![텍스트, 스크린샷, 소프트웨어, 멀티미디어 소프트웨어이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/a83d3e2e62e2776ded5ebd0c8ae379a8.png)

![텍스트, 스크린샷, 소프트웨어, 번호이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/47816e071e5b6055a1d50f852e2525ad.png)

Occurs when there is no ini file. Select the ini file.

![텍스트, 스크린샷, 소프트웨어, 컴퓨터 아이콘이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/dbf0f7f3f7ff02079900b2f64b998a60.png)

Occurs when there is no user information. Enter the red box user information.

![텍스트, 소프트웨어, 멀티미디어 소프트웨어, 컴퓨터 아이콘이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/632b22af12f197d60003b1823a9c18e8.png)

ini selection button disabled. Occurs when the user is not an Engineer. Select Engineer as the user.

![텍스트, 폰트, 라인, 스크린샷이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/70eb88e47bb059134f04525161478117.png)

Install “[Visual C++ Redistributable for Visual Studio 2015\~2022](https://cizentech-my.sharepoint.com/:u:/p/mason/EVMhVvG3-CtCtEEtHW4ev9wB4d4AobfjBobrFZFd4BxH6Q?e=UaIyb8)”

## 11. Appendix & Notes

-   2025-06-23
    -   Initial release

**CIZEN TECH Co., Ltd.**

624, 6F, 118 LS-ro 116beon-gil, Dongan-gu, Anyang-si, Gyeonggi-do, Republic of Korea

sw@cizentech.com

http://cizentech.com/

Disclaimer and Copyright Notice

Information in this document, including URL references, is subject to change without notice.

No permission is granted to use for purpose anything but descriptions in this document. Disorderly binding and page missing shall be replaced into a correct documentation
