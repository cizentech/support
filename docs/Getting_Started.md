# First connection

Connect a MIG frame grabber, check the image in CameraMaster, then integrate the SDK when the setup is working.

## 1. Identify your hardware

Record the MIG model and revision printed on the board. Check the [frame grabber specifications](FrameGrabber.md) and [deserializer guide](Deserializer.md) against your camera interface and configuration.

## 2. Prepare the software

Use [Downloads](Downloads.md) to find the driver and CameraMaster installation guide. Follow the [driver installation steps](DriverInstallation.md) for your model. MIG-S3 instructions require confirmation from support.

For Linux, start with [Linux & ROS2](Linux_ROS2.md). For a Jetson setup, see [NVIDIA Jetson](NVIDIA_Jetson_platform.md). Do not apply the Windows installation procedure to these platforms.

## 3. Confirm the connection

Check Device Manager for driver warnings, then launch CameraMaster and check the grabber connection status. If the board is not detected, use [Troubleshooting](Troubleshooting.md) before changing the camera configuration.

## 4. Load the matching configuration

Follow the [CameraMaster bring-up procedure](CameraMaster.md). Use the configuration supplied for your camera, serializer/deserializer and video format. Confirm power settings with your hardware documentation before applying them.

## 5. Check an image, then integrate

Check live video and the expected resolution/format in CameraMaster. Keep a copy of the working configuration. Continue with the [SDK reference](MIG_Grabber_SDK.md) for application integration or [Image Kit](ImageKit.md) for image analysis.

If a step fails, capture the exact error and use the [support request template](Technical_Support.md).
