# CameraMaster

**CameraMaster User Manual**

The CameraMaster (software GUI) interacts directly with the MIG-S2 Grabber to control camera modules, configure serializers/deserializers, and capture image in real-time.

![스크린샷, 멀티미디어 소프트웨어, 그래픽 소프트웨어, 소프트웨어이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/f3e1cedbc2b9b51676e8ca70ae92bdc9.png)![전자기기이(가) 표시된 사진 자동 생성된 설명](media/86713b5ed13dbb048f35c9678f511289.png)

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

**1. System Overview**

CameraMaster operates through a following data flow.

![텍스트, 스크린샷이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/ff60fa9b0cff9c3bbec0b7c2fc44b066.png)

-   **Configuration Data Flow (for settings):**  
    CameraMaster(PC USB) → S2 Board (I2C) → Deserializer (GMSL) → FAKRA Cable → Serializer (I2C) → Camera Module (I2C)
-   **Video Signal Flow (for image data):**  
    Camera Module (MIPI) → Serializer (GMSL) → FAKRA Cable → Deserializer (MIPI) → S2 Board(USB) → CameraMaster(PC)

**2. Configuration File Structure**

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

**3. Module Bring-up Procedure**

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

1.  **Bring-up Test Using CameraMaster**
2.  Select configuration file
3.  View configuration file contents
4.  Power ON camera module
5.  View live video
6.  Initialize sensor
7.  Power OFF
8.  Currently selected configuration file name
9.  Monitor frame status
10. Monitor Grabber board connection
11. Monitor I2C logs

![스크린샷, 멀티미디어 소프트웨어, 텍스트, 소프트웨어이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/13656e259ab4051972844d97b6491574.png)

**4. Offline Test Mode**

**4.1 Test Procedure**

1.  Select configuration(ini) file
2.  Load image file
3.  Save image file
4.  Open ini in Notepad
5.  Open Inspection Option window
6.  Set Offline test mode (test without capturing)
7.  Proceed Test item.
8.  Open the Inspection Options Settings window for the corresponding item.

![스크린샷, 텍스트, 멀티미디어 소프트웨어, 소프트웨어이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/49d8142b35b10757826fe55a3521f696.png)

**5. Additional Menu Functions**

![텍스트, 스크린샷, 디자인이(가) 표시된 사진 AI가 생성한 콘텐츠는 부정확할 수 있습니다.](media/a353e4925c15f7f2176c895fd8032615.png)

1.  Open report directory
2.  Open settings path
3.  Open item option file
4.  Access program folder

**6. Grabber Terminal Usage**

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

**7. Image Kit Content**

CameraMaster have a solution for camera module inspection.

-   SFR

    ![스크린샷이(가) 표시된 사진 자동 생성된 설명](media/891d17d21d23aef2970a95701e73e4c9.png) ![그래프, 라인, 스크린샷, 텍스트이(가) 표시된 사진 자동 생성된 설명](media/00284097ddf7f685e6e13b6be488a3c7.png) ![스크린샷, 직사각형, 다채로움, 그린이(가) 표시된 사진 자동 생성된 설명](media/a62ef24101ae8a09734d3a704e5d5500.png)

    \- Tested according to ISO-12233:2023 standard

    \- Measuring resolution with chart image including edges

-   Distortion

    ![스케치, 라인, 도표, 디자인이(가) 표시된 사진 자동 생성된 설명](media/f056982e041b7d432c9ed40cb7daa868.png)

\- Check the ratio of A and B using the SMIA standard inspection method

-   Defect

    ![다채로움, 그린이(가) 표시된 사진 자동 생성된 설명](media/91883e0de42175e07876e3fb8b2f581e.png) ![스크린샷, 어둠, 블랙이(가) 표시된 사진 자동 생성된 설명](media/78062be01231dd68f235923dd92f921b.png)

    \- This occurs when there is a defect in the sensor's pixels or foreign matter on the sensor surface.

    \- Perform tests in bright or dark environments

-   Stain (Blemish)

    ![](media/cdaee30cfe61312a1921e91cde3c4a03.emf) ![스크린샷, 달, 예술이(가) 표시된 사진 자동 생성된 설명](media/817bea45897508a4df58f1307f04a5f0.png)

    \- Defects due to foreign matter such as dust on the lens or between the lens and the image sensor

-   Optical Center

    ![텍스트, 스크린샷, 디자인, 예술이(가) 표시된 사진 자동 생성된 설명](media/cdc43d5d498ed57f88cdb9dfa283a672.png)

    \- Determine the location of the brightest area in the image and check how far it deviates from the center of the image.

-   Shading (Vignetting)

    ![텍스트, 스크린샷, 폰트, 도표이(가) 표시된 사진 자동 생성된 설명](media/ba22b58c4adafc73d39a356573e207e3.png)

    \- Test is conducted by comparing the difference in brightness between the central and peripheral areas.

-   Fixed Pattern Noise

    ![안개, 그레이이(가) 표시된 사진 자동 생성된 설명](media/7391765ab13216ab5fe43e4c13edf719.png) ![라인, 스크린샷이(가) 표시된 사진 자동 생성된 설명](media/2991157029a8891ee86429c7056b4864.png)

    \- This occurs because the pixel characteristics of the image sensor are not completely uniform.

\- Perform tests in bright or dark environments

-   Uniformity

    ![스크린샷, 직사각형, 화이트보드이(가) 표시된 사진 자동 생성된 설명](media/e37f0a310617bafe8cc03d728a2f4d4b.png)

    \- Check the uniformity of the image by measuring the standard deviation of the image.

**8. Driver Installation**

Install the MIG_Driver_win10_x64 package:

![텍스트, 폰트, 스크린샷이(가) 표시된 사진 자동 생성된 설명](media/24f7ac826006a1f50233abfc07da21e9.png)

![텍스트, 스크린샷, 폰트, 라인이(가) 표시된 사진 자동 생성된 설명](media/d510c68c255d79152026d3434cc52ab7.png)

![텍스트, 스크린샷, 폰트이(가) 표시된 사진 자동 생성된 설명](media/5295c0e89f0e336cad77bca047164ef3.png)

![텍스트, 폰트, 스크린샷이(가) 표시된 사진 자동 생성된 설명](media/8e6e2c8dc87bcada269f9d8f3a5d8b76.png)

**9. Appendix & Notes**

-   2025-06-23
    -   Initial release

**CIZEN TECH Co., Ltd.**

507, 8 Sanbon-ro 324beon-gil, Gunpo-si, Gyeonggi-do, Republic of Korea

contact@cizentech.com

http://cizentech.com/

Disclaimer and Copyright Notice

Information in this document, including URL references, is subject to change without notice.

No permission is granted to use for purpose anything but descriptions in this document. Disorderly binding and page missing shall be replaced into a correct documentation
