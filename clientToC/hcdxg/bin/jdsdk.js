!(function (e, n) {
  "function" == typeof define && (define.amd || define.cmd)
    ? define(function () {
        return n(e);
      })
    : n(e, !0);
})(this, function (e, n) {
  function i(n, i, r) {
    e.JDJSBridge
      ? JDJSBridge.invoke(n, t(i), function (e) {
          !(function (e, n, i) {
            delete n.err_code, delete n.err_desc, delete n.err_detail;
            var t = n.errMsg;
            t ||
              ((t = n.err_msg),
              delete n.err_msg,
              (t = (function (e, n) {
                var i = e,
                  t = f[i];
                t && (i = t);
                var r = "ok";
                if (n) {
                  var o = n.indexOf(":");
                  "confirm" == (r = n.substring(o + 1)) && (r = "ok"),
                    "failed" == r && (r = "fail"),
                    -1 != r.indexOf("failed_") && (r = r.substring(7)),
                    -1 != r.indexOf("fail_") && (r = r.substring(5)),
                    ("access denied" !=
                      (r = (r = r.replace(/_/g, " ")).toLowerCase()) &&
                      "no permission to execute" != r) ||
                      (r = "permission denied"),
                    "config" == i && "function not exist" == r && (r = "ok"),
                    "" == r && (r = "fail");
                }
                return (n = i + ":" + r);
              })(e, t)),
              (n.errMsg = t));
            (i = i || {})._complete && (i._complete(n), delete i._complete);
            (t = n.errMsg || ""),
              T.debug && !i.isInnerInvoke && alert(JSON.stringify(n));
            var r = t.indexOf(":");
            switch (t.substring(r + 1)) {
              case "ok":
                i.success && i.success(n);
                break;
              case "cancel":
                i.cancel && i.cancel(n);
                break;
              default:
                i.fail && i.fail(n);
            }
            i.complete && i.complete(n);
          })(n, e, r);
        })
      : o(n, r);
  }
  function t(e) {
    return (
      (e.appId = T.appId),
      (e.verifyAppId = T.appId),
      (e.verifySignType = "sha1"),
      (e.verifyTimestamp = T.timestamp + ""),
      (e.verifyNonceStr = T.nonceStr),
      (e.verifySignature = T.signature),
      e
    );
  }
  function r(e) {
    if (e) {
      for (var n = 0; n < e.length; ++n) {
        var i = e[n],
          t = s[i];
        t && (e[n] = t);
      }
      return e;
    }
  }
  function o(e, n) {
    if (!(!T.debug || (n && n.isInnerInvoke))) {
      var i = f[e];
      i && (e = i), n && n._complete && delete n._complete;
    }
  }
  function a() {
    return new Date().getTime();
  }
  function c(n) {
    e.webkit || e.JDJSBridge
      ? n()
      : u.addEventListener && u.addEventListener("JDJSBridgeReady", n, !1);
  }
  if (!e.jd) {
    var s = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "previewImage",
        getLocation: "getLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest",
        openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
        startSearchBeacons: "startMonitoringBeacons",
        stopSearchBeacons: "stopMonitoringBeacons",
        onSearchBeacons: "onBeaconsInRange",
        consumeAndShareCard: "consumedShareCard",
        openAddress: "editAddress",
      },
      f = (function () {
        var e = {};
        for (var n in s) e[s[n]] = n;
        return e;
      })(),
      u = e.document,
      d = navigator.userAgent.toLowerCase(),
      p = navigator.platform.toLowerCase(),
      m = !(!p.match("mac") && !p.match("win")),
      g = -1 != d.indexOf("micromessenger"),
      l = -1 != d.indexOf("android"),
      v = -1 != d.indexOf("iphone") || -1 != d.indexOf("ipad"),
      h = (A =
        d.match(/micromessenger\/(\d+\.\d+\.\d+)/) ||
        d.match(/micromessenger\/(\d+\.\d+)/))
        ? A[1]
        : "",
      y = {
        initStartTime: a(),
        initEndTime: 0,
        preVerifyStartTime: 0,
        preVerifyEndTime: 0,
      },
      k = {
        version: 1,
        appId: "",
        initTime: 0,
        preVerifyTime: 0,
        networkType: "",
        isPreVerifyOk: 1,
        systemType: v ? 1 : l ? 2 : -1,
        clientVersion: h,
        url: encodeURIComponent(location.href),
      },
      T = {},
      S = { _completes: [] },
      I = { state: 0, data: {} };
    c(function () {
      y.initEndTime = a();
    });
    var _ = {
      config: function (n) {
        (T = n), o("config", n);
        var f = !1 !== T.check;
        c(function () {
          if (f)
            i(
              s.config,
              { verifyJsApiList: r(T.jsApiList) },
              (function () {
                (S._complete = function (e) {
                  (y.preVerifyEndTime = a()), (I.state = 1), (I.data = e);
                }),
                  (S.success = function (e) {
                    k.isPreVerifyOk = 0;
                  }),
                  (S.fail = function (e) {
                    S._fail ? S._fail(e) : (I.state = -1);
                  });
                var e = S._completes;
                return (
                  e.push(function () {
                    m ||
                      T.debug ||
                      h < "6.0.2" ||
                      k.systemType < 0 ||
                      (new Image(),
                      (k.appId = T.appId),
                      (k.initTime = y.initEndTime - y.initStartTime),
                      (k.preVerifyTime =
                        y.preVerifyEndTime - y.preVerifyStartTime));
                  }),
                  (S.complete = function (n) {
                    for (var i = e.length, t = 0; t < i; ++t) e[t]();
                    S._completes = [];
                  }),
                  S
                );
              })()
            ),
              (y.preVerifyStartTime = a());
          else {
            I.state = 1;
            for (var e = S._completes, n = 0, t = e.length; n < t; ++n) e[n]();
            S._completes = [];
          }
        }),
          _.invoke &&
            ((_.invoke = function (n, i, r) {
              e.JDJSBridge && JDJSBridge.invoke(n, t(i), r);
            }),
            (_.on = function (n, i) {
              e.JDJSBridge && JDJSBridge.on(n, i);
            }));
      },
      ready: function (e) {
        0 != I.state ? e() : (S._completes.push(e), !g && T.debug && e());
      },
      error: function (e) {
        h < "6.0.2" || (-1 == I.state ? e(I.data) : (S._fail = e));
      },
      requestWebCookie: function (e) {
        i("requestWebCookie", { needpin: e.needpin }, e);
      },
      faceRecognition: function (e) {
        i(
          "faceRecognition",
          {
            businessId: e.businessId,
            appAuthorityKey: e.appAuthorityKey,
            verifyToken: e.verifyToken,
            appName: e.appName,
          },
          e
        );
      },
      navigateToNative: function (e) {
        i("navigateToNative", e);
      },
      checkJsApi: function (e) {
        (e._complete = function (e) {
          if (l) {
            var n = e.checkResult;
            if(n){
              if(typeof n === 'object'){
                e.checkResult = n;
              }else{
                e.checkResult = JSON.parse(n);
              }
            }
          }
          e = (function (e) {
            var n = e.checkResult;
            for (var i in n) {
              var t = f[i];
              t && ((n[t] = n[i]), delete n[i]);
            }
            return e;
          })(e);
        }),
          i("checkJsApi", { jsApiList: r(e.jsApiList) }, e);
      },
      closeWindow: function (e) {
        i("closeWindow", {}, (e = e || {}));
      },
      launchMiniProgram: function (e) {
        i(
          "launchMiniProgram",
          {
            targetAppId: e.targetAppId,
            path: (function (e) {
              if ("string" == typeof e && e.length > 0) {
                var n = e.split("?")[0],
                  i = e.split("?")[1];
                return (n += ".html"), void 0 !== i ? n + "?" + i : n;
              }
            })(e.path),
            envVersion: e.envVersion,
          },
          e
        );
      },
      miniProgram: {
        navigateBack: function (e) {
          (e = e || {}),
            c(function () {
              i(
                "invokeMiniProgramAPI",
                { name: "navigateBack", arg: { delta: e.delta || 1 } },
                e
              );
            });
        },
        navigateTo: function (e) {
          (e = e || {}),
            c(function () {
              i(
                "invokeMiniProgramAPI",
                { name: "navigateTo", arg: { url: e.url } },
                e
              );
            });
        },
        redirectTo: function (e) {
          c(function () {
            i(
              "invokeMiniProgramAPI",
              { name: "redirectTo", arg: { url: e.url } },
              e
            );
          });
        },
        switchTab: function (e) {
          c(function () {
            i(
              "invokeMiniProgramAPI",
              { name: "switchTab", arg: { url: e.url } },
              e
            );
          });
        },
        reLaunch: function (e) {
          c(function () {
            i(
              "invokeMiniProgramAPI",
              { name: "reLaunch", arg: { url: e.url } },
              e
            );
          });
        },
        postMessage: function (e) {
          c(function () {
            i(
              "invokeMiniProgramAPI",
              { name: "postMessage", arg: e.data || {} },
              e
            );
          });
        },
        getEnv: function (n) {
          c(function () {
            n({ miniprogram: "miniprogram" === e.__jdjs_environment });
          });
        },
      },
    };
    return n && (e.jd = _), _;
  }
  var A;
});
