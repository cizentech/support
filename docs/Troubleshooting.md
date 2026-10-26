# Troubleshooting

Start with the failing stage and collect the evidence below. These checks complement the model-specific documentation.

| Symptom | First checks | What to record |
| --- | --- | --- |
| Board not detected | Confirm the model-specific driver, cable connection and Device Manager status | Board model/revision, OS, driver version, warning/error code |
| CameraMaster cannot connect | Check device detection, then the connection status shown in CameraMaster | Application version and exact error text |
| Connected, but no image | Confirm that the supplied configuration matches the camera, serializer/deserializer and video format | Configuration file, initialization result, resolution and format |
| Register / I2C error | Compare the selected configuration and connection with the hardware guide | Failed command, register address and returned error |
| Frame loss or unexpected format | Compare resolution, frame rate and pixel format with the [bandwidth reference](Resolution_Bandwidth.md) | Requested settings, observed behavior and capture logs |
| SDK-only failure | Verify the same setup in CameraMaster, then check SDK architecture, call order and return codes | SDK version, minimal reproduction and first failing call |

## Before contacting support

Keep the working configuration and original logs. Reproduce with the smallest set of steps you can, and note whether the problem also occurs in CameraMaster. Do not change voltage settings or substitute a different model's driver as a troubleshooting shortcut.

Use the [support request template](Technical_Support.md) to send the details to the engineering team.
