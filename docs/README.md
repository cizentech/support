<div class="cz-hero">
  <div class="cz-hero-copy">
  <div class="cz-hero-eyebrow">CIZEN TECH · Technical Support</div>
  <h1 class="cz-hero-title">Frame grabbers &amp; software.<br>From setup to integration.</h1>
  <p class="cz-hero-desc">
    Installation, control, image capture and analysis guides for MIG frame grabbers, CameraMaster and the SDK. Find your next step below.
  </p>
  <div class="cz-hero-actions">
    <a class="cz-btn cz-btn-primary" href="#/Getting_Started">Get Started →</a>
    <a class="cz-btn" href="#/MIG_Grabber_SDK">Browse the SDK</a>
  </div>
  </div>
  <figure class="cz-hero-visual">
    <div class="product-media"><span class="product-overline">MIG SERIES / FRAME GRABBER</span><img src="img/MIG-S6.png" alt="MIG-S6 frame grabber with four camera connectors and Thunderbolt 3 ports" width="809" height="539"></div>
    <figcaption><strong>MIG-S6</strong><span>Capture · Control · Analyze</span><a href="#/FrameGrabber">Explore the hardware →</a></figcaption>
  </figure>
</div>

## What would you like to do?

<div class="cz-task-grid">
  <a class="cz-card" href="#/Getting_Started"><span class="cz-card-tag">01 / SETUP</span><div class="cz-card-title">Connect your first board →</div><div class="cz-card-desc">Identify your model, install the driver and check your first image.</div></a>
  <a class="cz-card" href="#/MIG_Grabber_SDK"><span class="cz-card-tag">02 / DEVELOP</span><div class="cz-card-title">Integrate the SDK →</div><div class="cz-card-desc">Find API signatures and C++, Python and C# examples.</div></a>
  <a class="cz-card" href="#/Troubleshooting"><span class="cz-card-tag">03 / RESOLVE</span><div class="cz-card-title">Find and report an issue →</div><div class="cz-card-desc">Check device detection, video and configuration before contacting support.</div></a>
</div>

## Explore the docs

<div class="cz-card-grid">

  <a class="cz-card" href="#/FrameGrabber">
    <div class="cz-card-tag">Hardware</div>
    <div class="cz-card-title">Frame Grabber</div>
    <div class="cz-card-desc">MIG-S2 / S2 Pro / S3 / S6 MIPI capture cards — key features, models, and specifications.</div>
  </a>

  <a class="cz-card" href="#/CameraMaster">
    <div class="cz-card-tag">Viewer</div>
    <div class="cz-card-title">CameraMaster</div>
    <div class="cz-card-desc">Real-time capture, configuration files, bring-up procedures, and the Grabber terminal.</div>
  </a>

  <a class="cz-card" href="#/MIG_Grabber_SDK">
    <div class="cz-card-tag">SDK</div>
    <div class="cz-card-title">MIG Grabber SDK</div>
    <div class="cz-card-desc">C++, Python, and C# APIs for controlling the grabber from your own application.</div>
  </a>

  <a class="cz-card" href="#/DriverInstallation">
    <div class="cz-card-tag">Setup</div>
    <div class="cz-card-title">Driver Installation</div>
    <div class="cz-card-desc">MIG-S2 and S6 driver packages, installation checks, and MIG-S3 support guidance.</div>
  </a>

  <a class="cz-card" href="#/CameraMasterFramework">
    <div class="cz-card-tag">Framework</div>
    <div class="cz-card-title">CameraMaster Framework</div>
    <div class="cz-card-desc">Build custom inspection items with FrameworkBridge and the test-item lifecycle.</div>
  </a>

  <a class="cz-card" href="#/ImageKit">
    <div class="cz-card-tag">Inspection</div>
    <div class="cz-card-title">Image Kit</div>
    <div class="cz-card-desc">SFR, distortion, defect, blemish, shading — the built-in image-quality test set.</div>
  </a>

  <a class="cz-card" href="#/Deserializer">
    <div class="cz-card-tag">Hardware</div>
    <div class="cz-card-title">Deserializer</div>
    <div class="cz-card-desc">TI and MAXIM deserializer selection, channel mapping, and terminal commands.</div>
  </a>

  <a class="cz-card" href="#/NVIDIA_Jetson_platform">
    <div class="cz-card-tag">Platform</div>
    <div class="cz-card-title">NVIDIA Jetson</div>
    <div class="cz-card-desc">Jetson TX2 / Xavier / Orin deserializer boards for GPU-side image acquisition.</div>
  </a>

  <a class="cz-card" href="#/Resolution_Bandwidth">
    <div class="cz-card-tag">Reference</div>
    <div class="cz-card-title">Resolution &amp; Bandwidth</div>
    <div class="cz-card-desc">Megapixels to pixel counts to link bandwidth — which MIG board and GMSL rate carries each resolution / format / fps.</div>
  </a>

  <a class="cz-card" href="#/Technical_Support">
    <div class="cz-card-tag">Help</div>
    <div class="cz-card-title">Technical Support</div>
    <div class="cz-card-desc">Reach the engineering team for issues that aren't covered by the docs.</div>
  </a>

</div>

## Quick start

<div class="cz-steps">

  <div class="cz-step">
    <div class="cz-step-num">1</div>
    <div class="cz-step-body">
      <div class="cz-step-title">Install the driver</div>
      <div class="cz-step-desc">Install Visual C++ Redistributable 2015–2022, then the MIG driver matching your board (S2 / S6; contact support for S3). See <a href="#/DriverInstallation">Driver Installation</a>.</div>
    </div>
  </div>

  <div class="cz-step">
    <div class="cz-step-num">2</div>
    <div class="cz-step-body">
      <div class="cz-step-title">Install CameraMaster</div>
      <div class="cz-step-desc">Run the CameraMaster installer and launch the application. The Grabber connection status should turn green.</div>
    </div>
  </div>

  <div class="cz-step">
    <div class="cz-step-num">3</div>
    <div class="cz-step-body">
      <div class="cz-step-title">Load a module configuration</div>
      <div class="cz-step-desc">Pick a <code>.ini</code> file that matches your module / SER / DES / video format and review the contents in CameraMaster.</div>
    </div>
  </div>

  <div class="cz-step">
    <div class="cz-step-num">4</div>
    <div class="cz-step-body">
      <div class="cz-step-title">Bring up the camera</div>
      <div class="cz-step-desc">Power the module, initialize the sensor, and check live video. From here, run inspection items or integrate via the <a href="#/MIG_Grabber_SDK">SDK</a>.</div>
    </div>
  </div>

</div>

---

<div class="cz-footer">
  <strong>CIZEN TECH Co., Ltd.</strong> · 624, 6F, 118 LS-ro 116beon-gil, Dongan-gu, Anyang-si, Gyeonggi-do, Republic of Korea<br>
  <a href="mailto:sw@cizentech.com">sw@cizentech.com</a> · <a href="https://www.cizentech.com/" target="_blank" rel="noopener">cizentech.com</a>
</div>
