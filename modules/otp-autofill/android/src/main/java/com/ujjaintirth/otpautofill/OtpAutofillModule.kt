package com.ujjaintirth.otpautofill

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import androidx.core.content.ContextCompat
import com.google.android.gms.auth.api.identity.GetPhoneNumberHintIntentRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class OtpAutofillModule : Module() {
  private var phoneHintPromise: Promise? = null
  private var smsReceiver: BroadcastReceiver? = null

  override fun definition() = ModuleDefinition {
    Name("OtpAutofill")
    Events("onOtpReceived")

    AsyncFunction("requestPhoneNumberHintAsync") { promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.reject("ERR_NO_ACTIVITY", "The phone-number picker needs an active screen.", null)
        return@AsyncFunction
      }
      if (phoneHintPromise != null) {
        promise.reject("ERR_PICKER_ACTIVE", "The phone-number picker is already open.", null)
        return@AsyncFunction
      }

      phoneHintPromise = promise
      val request = GetPhoneNumberHintIntentRequest.builder().build()
      Identity.getSignInClient(activity)
        .getPhoneNumberHintIntent(request)
        .addOnSuccessListener { pendingIntent ->
          try {
            activity.startIntentSenderForResult(
              pendingIntent.intentSender,
              PHONE_HINT_REQUEST_CODE,
              null,
              0,
              0,
              0
            )
          } catch (error: Exception) {
            rejectPhoneHint("ERR_PHONE_HINT", "Unable to open the phone-number picker.", error)
          }
        }
        .addOnFailureListener { error ->
          rejectPhoneHint("ERR_PHONE_HINT", "No phone number is available from Google Play services.", error)
        }
    }.runOnQueue(Queues.MAIN)

    OnActivityResult { activity, result ->
      if (result.requestCode == PHONE_HINT_REQUEST_CODE) {
        val promise = phoneHintPromise ?: return@OnActivityResult
        phoneHintPromise = null
        if (result.resultCode != Activity.RESULT_OK || result.data == null) {
          promise.reject("ERR_PHONE_HINT_CANCELLED", "Phone-number selection was cancelled.", null)
          return@OnActivityResult
        }

        try {
          promise.resolve(Identity.getSignInClient(activity).getPhoneNumberFromIntent(result.data))
        } catch (error: Exception) {
          promise.reject("ERR_PHONE_HINT", "Unable to read the selected phone number.", error)
        }
        return@OnActivityResult
      }

      if (result.requestCode == SMS_CONSENT_REQUEST_CODE) {
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
          val message = result.data?.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE).orEmpty()
          SIX_DIGIT_CODE.find(message)?.value?.let { code ->
            sendEvent("onOtpReceived", mapOf("code" to code, "message" to message))
          }
        }
        unregisterSmsReceiver()
        return@OnActivityResult
      }
    }

    AsyncFunction("startSmsUserConsentAsync") { sender: String?, promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.reject("ERR_NO_CONTEXT", "SMS User Consent is unavailable.", null)
        return@AsyncFunction
      }

      unregisterSmsReceiver()
      val receiver = createSmsReceiver()
      smsReceiver = receiver
      ContextCompat.registerReceiver(
        context,
        receiver,
        IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION),
        SmsRetriever.SEND_PERMISSION,
        null,
        ContextCompat.RECEIVER_EXPORTED
      )

      val client = SmsRetriever.getClient(context)
      val task = if (sender.isNullOrBlank()) {
        client.startSmsUserConsent(null)
      } else {
        client.startSmsUserConsent(sender.trim())
      }

      task
        .addOnSuccessListener { promise.resolve() }
        .addOnFailureListener { error ->
          unregisterSmsReceiver()
          promise.reject("ERR_SMS_USER_CONSENT", "Unable to start SMS User Consent.", error)
        }
    }

    AsyncFunction("startSmsRetrieverAsync") { promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.reject("ERR_NO_CONTEXT", "SMS Retriever is unavailable.", null)
        return@AsyncFunction
      }

      unregisterSmsReceiver()
      val receiver = createSmsReceiver()
      smsReceiver = receiver
      ContextCompat.registerReceiver(
        context,
        receiver,
        IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION),
        SmsRetriever.SEND_PERMISSION,
        null,
        ContextCompat.RECEIVER_EXPORTED
      )

      SmsRetriever.getClient(context).startSmsRetriever()
        .addOnSuccessListener { promise.resolve() }
        .addOnFailureListener { error ->
          unregisterSmsReceiver()
          promise.reject("ERR_SMS_RETRIEVER", "Unable to start SMS Retriever.", error)
        }
    }

    Function("stopSmsRetriever") {
      unregisterSmsReceiver()
    }

    OnDestroy {
      unregisterSmsReceiver()
      phoneHintPromise?.reject("ERR_MODULE_DESTROYED", "OTP autofill was closed.", null)
      phoneHintPromise = null
    }
  }

  private fun createSmsReceiver() = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      if (intent.action != SmsRetriever.SMS_RETRIEVED_ACTION) return

      val extras = intent.extras ?: return
      val status = extras.get(SmsRetriever.EXTRA_STATUS) as? Status ?: return
      if (status.statusCode == CommonStatusCodes.SUCCESS) {
        val directMessage = extras.getString(SmsRetriever.EXTRA_SMS_MESSAGE)
        if (!directMessage.isNullOrEmpty()) {
          SIX_DIGIT_CODE.find(directMessage)?.value?.let { code ->
            sendEvent("onOtpReceived", mapOf("code" to code, "message" to directMessage))
          }
          unregisterSmsReceiver()
          return
        }

        // SMS User Consent path: launch native one-tap consent prompt
        val consentIntent = extras.getParcelable<Intent>(SmsRetriever.EXTRA_CONSENT_INTENT)
        val activity = appContext.currentActivity
        if (consentIntent != null && activity != null) {
          try {
            activity.startActivityForResult(consentIntent, SMS_CONSENT_REQUEST_CODE)
            return
          } catch (_: Exception) {
            // Activity cannot launch consent intent
          }
        }
      }
      unregisterSmsReceiver()
    }
  }

  private fun unregisterSmsReceiver() {
    val receiver = smsReceiver ?: return
    try {
      appContext.reactContext?.unregisterReceiver(receiver)
    } catch (_: IllegalArgumentException) {
      // The OS may already have unregistered the one-shot receiver.
    }
    smsReceiver = null
  }

  private fun rejectPhoneHint(code: String, message: String, error: Throwable?) {
    phoneHintPromise?.reject(code, message, error)
    phoneHintPromise = null
  }

  private companion object {
    const val PHONE_HINT_REQUEST_CODE = 8107
    const val SMS_CONSENT_REQUEST_CODE = 8108
    val SIX_DIGIT_CODE = Regex("(?<!\\d)\\d{6}(?!\\d)")
  }
}
