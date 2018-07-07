package com.tronwallet2;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Fabric.with(this, new Crashlytics());
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }

    // my new code here
    @Override
    protected void onPause() {
      SplashScreen.hide(this);
      super.onPause();
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "tronwallet2";
    }
}
