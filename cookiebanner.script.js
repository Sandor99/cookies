"use strict";

var config = {
  primaryColor: "#3f5a3a",
  darkColor: "#3b3e4a",
  lightColor: "#ffffff",
  themeMode: "light",

  showSettingsBtn: true,
  showCloseIcon: false,
  showDeclineBtn: true,

  fullWidth: false,
  displayPosition: "right",

  settingsBtnLabel: "Configurar cookies",
  delay: 1500,
  expires: 365,

  title: "Uso de cookies",

  description:
    "Este sitio web utiliza cookies técnicas y de personalización necesarias para su correcto funcionamiento. " +
    "De forma opcional, y siempre con tu consentimiento, también se pueden utilizar cookies de análisis para " +
    "obtener estadísticas anónimas sobre el uso del sitio web y mejorar nuestros servicios.",

  acceptBtnLabel: "Aceptar todas",
  declineInfoBtnLabel: "Rechazar",
  moreInfoBtnLabel: "Política de Cookies",
  moreInfoBtnLink: "https://www.lacasadelpastorbenaocaz.com/politica-de-cookies",

  cookieTypesTitle: "Configuración de cookies",

  necessaryCookieTypeLabel: "Cookies necesarias",
  necessaryCookieTypeDesc:
    "Estas cookies son imprescindibles para el funcionamiento básico del sitio web y no pueden desactivarse.",

  cookieTypes: [
    {
      type: "Personalización",
      value: "preferences",
      description:
        "Permiten recordar preferencias del usuario, como la aceptación de la política de cookies."
    },
    {
      type: "Analíticas",
      value: "analytics",
      description:
        "Permiten obtener estadísticas anónimas sobre la navegación para mejorar el funcionamiento del sitio web."
    }
  ]
};

function appendScriptInHead(type) {
  if (typeof headerScripts === "undefined") return;
  headerScripts.forEach(function (script) {
    if (script.type === type) {
      document.head.insertAdjacentHTML("beforeend", script.value);
    }
  });
}

function injectScripts() {
  if (cookieBanner.isPreferenceAccepted("analytics")) {
    appendScriptInHead("analytics");
  }
}

(function ($) {
  $.fn.cookieBanner = function () {
    $(":root").css("--cookieBannerLight", config.lightColor);
    $(":root").css("--cookieBannerDark", config.darkColor);

    if (getCookie("cookieConsent")) {
      injectScripts();
      return;
    }

    $("#cookieBanner").remove();

    var cookieList =
      '<li>' +
      '<input type="checkbox" checked disabled>' +
      '<label title="' + config.necessaryCookieTypeDesc + '">' +
      config.necessaryCookieTypeLabel +
      "</label></li>";

    config.cookieTypes.forEach(function (item) {
      cookieList +=
        '<li>' +
        '<input type="checkbox" value="' + item.value + '">' +
        '<label title="' + item.description + '">' +
        item.type +
        "</label></li>";
    });

    var banner =
      '<div id="cookieBanner" class="' + config.themeMode + '">' +
      '<h4>' + config.title + '</h4>' +
      '<p>' + config.description +
      ' <a href="' + config.moreInfoBtnLink + '">' +
      config.moreInfoBtnLabel + '</a></p>' +

      '<div id="cookieSettings">' + config.settingsBtnLabel + '</div>' +
      '<div id="cookieTypes" style="display:none;">' +
      '<h5>' + config.cookieTypesTitle + '</h5>' +
      '<ul>' + cookieList + '</ul>' +
      '</div>' +

      '<div class="btn-wrap">' +
      '<button id="cookieAccept">' + config.acceptBtnLabel + '</button>' +
      '<button id="cookieReject">' + config.declineInfoBtnLabel + '</button>' +
      '</div>' +
      '</div>';

    setTimeout(function () {
      $("body").append(banner);
    }, config.delay);

    $("body").on("click", "#cookieAccept", function () {
      setCookie("cookieConsent", true, config.expires);

      var prefs = [];
      $("#cookieTypes input:checked").each(function () {
        prefs.push($(this).val());
      });

      setCookie("cookieConsentPrefs", JSON.stringify(prefs), config.expires);
      injectScripts();
      $("#cookieBanner").remove();
    });

    $("body").on("click", "#cookieReject", function () {
      setCookie("cookieConsent", false, config.expires);
      setCookie("cookieConsentPrefs", "", -1);
      $("#cookieBanner").remove();
    });

    $("body").on("click", "#cookieSettings", function () {
      $("#cookieTypes").toggle();
    });
  };

  function setCookie(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      "; expires=" + date.toUTCString() +
      "; path=/";
  }

  function getCookie(name) {
    return document.cookie.split("; ").find(row => row.startsWith(name + "="));
  }

  window.cookieBanner = {
    init: function () {
      $.fn.cookieBanner();
    },
    isPreferenceAccepted: function (type) {
      var prefs = getCookie("cookieConsentPrefs");
      if (!prefs) return false;
      return decodeURIComponent(prefs).includes(type);
    }
  };
})(jQuery);
✅ Cómo incluirlo en la web
