# Linux & ROS2

The MIG Grabber SDK also runs on Linux, and a ROS2 package is provided so that the grabber can publish captured frames directly into a ROS2 graph.

## Ubuntu 22.04 LTS

**The MIG Grabber SDK operates on Ubuntu 22.04 LTS with the MIG-S2 board, using the same `.ini` module configuration files as on Windows.**

Power on, register init, sync check, and live streaming work the same way as on Windows — the SDK reports the connected board, power state, and streaming frame rate.

![MIG Grabber SDK sample application on Ubuntu 22.04 LTS with the MIG-S2 board](media/Ubuntu_22.04_LTS_Test_with_S2.png)

```
[11:16:23] SDK version: 237
[11:16:23] Using S2 (id 0)
[11:16:23] Config file: /home/cizen/myDev/shareWin/D3.ini
[11:16:28] OpenGrabber(S2) ret=0
[11:16:28] Power On ret=0
[11:16:29] Register Init ret=0
[11:16:30] HSync=1920 (1920), VSync=1080 (1080)
[11:16:31] Live started
```

## ROS2

**The `mig_grabber_cpp` package brings the grabber up as a ROS2 node (`mig_camera_cpp`) and publishes the captured images as `sensor_msgs/msg/Image`.**

Launch the node:

```bash
ros2 launch mig_grabber_cpp mig_camera_cpp.launch.py
```

![ROS2 mig_camera_cpp node streaming from the MIG-S2 board](media/Ubuntu_22.04_LTS__ROS2_Test_with_S2.png)

### Published topics

| Topic | Type | Description |
|---|---|---|
| `/mig_camera_cpp/image_raw` | `sensor_msgs/msg/Image` | Captured frames |
| `/mig_camera_cpp/camera_info` | `sensor_msgs/msg/CameraInfo` | Camera information |
| `/mig_camera_cpp/status` | `std_msgs/msg/String` | Board, power, and streaming status |

List the topics with their types:

```bash
ros2 topic list -t
```

Read the current status:

```bash
ros2 topic echo /mig_camera_cpp/status --once
```

```
data: status=streaming powered=True streaming=True frames=8945 fps=29.9842 wait_ms=32.0591
```
