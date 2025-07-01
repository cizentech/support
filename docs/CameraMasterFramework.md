# CameraMaster Framework

![텍스트, 도표, 스크린샷, 직사각형이(가) 표시된 사진 AI 생성 콘텐츠는 정확하지 않을 수 있습니다.](media/6fbc91c83bddc9d52319f642a037aa51.png)

## CameraMaster Application

\* Main executable application for image acquisition and inspection

\* Renders captured video streams in real-time

\* Executes test items for automated image analysis and validation

\* Generates inspection reports and logs based on test results

## ImgProcX library

\* High-performance image processing library

\* Provides functions for image format conversion (e.g., demosaicing raw Bayer images)

\* Optimized for parallel execution to enhance high-speed

\* Utilizes GPU acceleration for high-speed processing of large image data

## SDK library

\* Provides a API for control of the image grabber

\* Supports image sensor initialization, register configuration, and real-time image capture

## FrameworkBridge library

\* Core interface library for test item development

\* Defines standardized communication protocols between the application and test modules

\* Enables test item integration and lifecycle management within the main application

## 

## Test Item

\* User-implementable inspection module based on ‘FrameworkBridge’

\* Acquires image data from the grabber for custom analysis

\* Performs algorithmic evaluation on captured frames (e.g., defect detection, measurement, etc.)

\* Communicates inspection results back to the main application for display and report generation
