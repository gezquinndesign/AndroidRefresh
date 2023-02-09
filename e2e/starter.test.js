const { execSync } = require('child_process')
const {device} = require('detox')
describe('Example', () => {
  beforeAll(async () => {
    console.log('beforeAll')
    await device.launchApp()
  })
  
  // beforeEach(async () => {
  //   console.log('beforeEach')
  //   await device.reloadReactNative()
  // })

  const OPTIONS = {
    timeout: 10000,
    killSignal: 'SIGKILL',
  }

  it('should take screenshots', async () => {
    const fileName = `screenshot.png`

    if (device.getPlatform() === 'android') {
      // enter demo mode
      execSync('adb shell settings put global sysui_demo_allowed 1')
      // display time 12:00
      execSync(
        'adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1200',
      )
      // Display full mobile data with 4g type and no wifi
      execSync(
        'adb shell am broadcast -a com.android.systemui.demo -e command network -e mobile show -e level 4 -e datatype 4g -e wifi false',
      )
      // Hide notifications
      execSync(
        'adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false',
      )
      // Show full battery but not in charging state
      execSync(
        'adb shell am broadcast -a com.android.systemui.demo -e command battery -e plugged false -e level 100',
      )
      // const fileAddress = `/sdcard/${fileName}`;
      execSync(`adb shell screencap /sdcard/${fileName}`, OPTIONS)
      execSync(
        `adb pull /sdcard/${fileName} $(pwd)/fastlane/screenshots/`,
        OPTIONS,
      )
    } else {
      execSync(
        'xcrun simctl status_bar booted clear',
        OPTIONS,
      )
      execSync(
        'xcrun simctl status_bar booted override --time "12:00" --batteryState charged --batteryLevel 100',
        OPTIONS,
      )
      execSync(
        'xcrun simctl status_bar booted override --cellularBars 4 --dataNetwork 4g',
        OPTIONS,
      )
      await new Promise((resolve) => setTimeout(resolve, 10000))
      execSync(
        `xcrun simctl io booted screenshot $(pwd)/fastlane/screenshots/${fileName}`,
        OPTIONS,
      )
    }
  })
})
