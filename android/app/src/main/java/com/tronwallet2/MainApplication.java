package com.tronwallet2;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import io.sentry.RNSentryPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.smixx.fabric.FabricPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.getty.rntron.RNTronPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import org.reactnative.camera.RNCameraPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNI18nPackage(),
          new RNSentryPackage(),
          new RNBackgroundFetchPackage(),
          new ReactNativeOneSignalPackage(),
          new FabricPackage(),
          new RNDeviceInfo(),
          new RNTronPackage(),
          new ReactNativeConfigPackage(),
          new RNCameraPackage(),
          new SplashScreenReactPackage(),
          new RealmReactPackage(),
          new VectorIconsPackage(),
          new SvgPackage(),
          new LinearGradientPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
