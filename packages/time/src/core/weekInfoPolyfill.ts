interface WeekInfo {
  firstDay: number
  weekend: number[]
  minimalDays: number
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Intl {
  interface Locale {
    getWeekInfo: () => WeekInfo
  }
}

;(function () {
  if (typeof (Intl as any).Locale.prototype.getWeekInfo !== 'function') {
    ;(Intl as any).Locale.prototype.getWeekInfo = function () {
      const locale = this.toString().toLowerCase()
      const weekInfo: Record<string, WeekInfo> = {
        af_NA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        af_ZA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        af: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ak_GH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ak: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sq_AL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sq: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        am_ET: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        am: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_DZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_BH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_EG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_IQ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_JO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_KW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_LB: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_LY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_MA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_OM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_QA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_SA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_SD: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_SY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_TN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_AE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar_YE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ar: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hy_AM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hy: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        as_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        as: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        asa_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        asa: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        az_Cyrl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        az_Latn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        az: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bm_ML: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bm: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        eu_ES: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        eu: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        be_BY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        be: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bem_ZM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bem: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bez_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bez: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bn_BD: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bn_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bs_BA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bs: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bg_BG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bg: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        my_MM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        my: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ca_ES: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ca: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        tzm_Latn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        tzm: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        chr_US: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        chr: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        cgg_UG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        cgg: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        zh_Hans: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        zh_Hant: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        zh: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kw_GB: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kw: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hr_HR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hr: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        cs_CZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        cs: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        da_DK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        da: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nl_BE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nl_NL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ebu_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ebu: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_AS: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_AU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_BE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_BZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_BW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_CA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_GU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_HK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_IE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_IL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_JM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_MT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_MH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_MU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_NA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_NZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_MP: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_PK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_PH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_SG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_ZA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_TT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_UM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_VI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_GB: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_US: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en_ZW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        en: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        eo: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        et_EE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        et: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ee_GH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ee_TG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ee: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fo_FO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fo: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fil_PH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fil: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fi_FI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fi: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_BE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_BJ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_BF: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_BI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CF: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_TD: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_KM: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CD: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_DJ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_GQ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_FR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_GA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_GP: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_GN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_LU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_MG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_ML: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_MQ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_MC: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_NE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_RW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_RE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_BL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_MF: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_SN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_CH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr_TG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fr: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ff_SN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ff: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gl_ES: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lg_UG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lg: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ka_GE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ka: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de_AT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de_BE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de_DE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de_LI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de_LU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de_CH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        de: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        el_CY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        el_GR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        el: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gu_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gu: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        guz_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        guz: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ha_Latn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ha: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        haw_US: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        haw: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        he_IL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        he: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hi_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hi: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hu_HU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        hu: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        is_IS: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        is: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ig_NG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ig: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        id_ID: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        id: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ga_IE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ga: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        it_IT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        it_CH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        it: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ja_JP: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ja: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kea_CV: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kea: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kab_DZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kab: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kl_GL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kln_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kln: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kam_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kam: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kn_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kk_Cyrl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kk: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        km_KH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        km: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ki_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ki: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rw_RW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rw: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kok_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kok: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ko_KR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ko: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        khq_ML: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        khq: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ses_ML: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ses: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lag_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lag: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lv_LV: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lv: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lt_LT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        lt: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        luo_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        luo: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        luy_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        luy: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mk_MK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mk: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        jmc_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        jmc: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kde_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        kde: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mg_MG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mg: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ms_BN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ms_MY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ms: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ml_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ml: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mt_MT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mt: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gv_GB: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gv: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mr_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mr: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mas_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mas_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mas: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mer_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mer: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mfe_MU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        mfe: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        naq_NA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        naq: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ne_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ne_NP: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ne: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nd_ZW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nd: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nb_NO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nb: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nn_NO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nyn_UG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        nyn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        or_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        or: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        om_ET: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        om_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        om: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ps_AF: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ps: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fa_AF: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fa_IR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        fa: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pl_PL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pt_BR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pt_GW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pt_MZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pt_PT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pt: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pa_Arab: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pa_Guru: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        pa: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ro_MD: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ro_RO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ro: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rm_CH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rm: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rof_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rof: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ru_MD: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ru_RU: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ru_UA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ru: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rwk_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        rwk: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        saq_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        saq: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sg_CF: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sg: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        seh_MZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        seh: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sr_Cyrl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sr_Latn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sr: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sn_ZW: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ii_CN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ii: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        si_LK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        si: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sk_SK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sk: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sl_SI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        xog_UG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        xog: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        so_DJ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        so_ET: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        so_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        so_SO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        so: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_AR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_BO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_CL: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_CO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_CR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_DO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_EC: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_SV: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_GQ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_GT: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_HN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_419: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_MX: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_NI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_PA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_PY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_PE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_PR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_ES: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_US: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_UY: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es_VE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        es: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sw_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sw_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sw: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sv_FI: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sv_SE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        sv: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gsw_CH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        gsw: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        shi_Latn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        shi_Tfng: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        shi: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        dav_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        dav: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ta_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ta_LK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ta: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        te_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        te: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        teo_KE: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        teo_UG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        teo: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        th_TH: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        th: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bo_CN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bo_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        bo: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ti_ER: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ti_ET: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ti: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        to_TO: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        to: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        tr_TR: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        tr: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        uk_UA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        uk: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ur_IN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ur_PK: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        ur: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        uz_Arab: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        uz_Cyrl: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        uz_Latn: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        uz: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        vi_VN: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        vi: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        vun_TZ: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        vun: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        cy_GB: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        cy: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        yo_NG: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        yo: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        zu_ZA: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        zu: {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'af-ZA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'am-ET': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-AE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-BH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-DZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-EG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-IQ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-JO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-KW': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-LB': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-LY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-MA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'arn-CL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-OM': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-QA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-SA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-SD': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-SY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-TN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ar-YE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'as-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'az-az': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'az-Cyrl-AZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'az-Latn-AZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ba-RU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'be-BY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'bg-BG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'bn-BD': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'bn-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'bo-CN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'br-FR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'bs-Cyrl-BA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'bs-Latn-BA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ca-ES': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'co-FR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'cs-CZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'cy-GB': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'da-DK': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'de-AT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'de-CH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'de-DE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'de-LI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'de-LU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'dsb-DE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'dv-MV': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'el-CY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'el-GR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-029': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-AU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-BZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-CA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-cb': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-GB': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-IE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-JM': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-MT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-MY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-NZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-PH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-SG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-TT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-US': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-ZA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'en-ZW': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-AR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-BO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-CL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-CO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-CR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-DO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-EC': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-ES': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-GT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-HN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-MX': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-NI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-PA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-PE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-PR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-PY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-SV': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-US': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-UY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'es-VE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'et-EE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'eu-ES': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fa-IR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fi-FI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fil-PH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fo-FO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fr-BE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fr-CA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fr-CH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fr-FR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fr-LU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fr-MC': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'fy-NL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ga-IE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'gd-GB': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'gd-ie': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'gl-ES': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'gsw-FR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'gu-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ha-Latn-NG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'he-IL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'hi-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'hr-BA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'hr-HR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'hsb-DE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'hu-HU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'hy-AM': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'id-ID': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ig-NG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ii-CN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'in-ID': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'is-IS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'it-CH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'it-IT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'iu-Cans-CA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'iu-Latn-CA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'iw-IL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ja-JP': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ka-GE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'kk-KZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'kl-GL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'km-KH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'kn-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'kok-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ko-KR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ky-KG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'lb-LU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'lo-LA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'lt-LT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'lv-LV': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'mi-NZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'mk-MK': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ml-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'mn-MN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'mn-Mong-CN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'moh-CA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'mr-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ms-BN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ms-MY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'mt-MT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'nb-NO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ne-NP': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'nl-BE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'nl-NL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'nn-NO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'no-no': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'nso-ZA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'oc-FR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'or-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'pa-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'pl-PL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'prs-AF': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ps-AF': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'pt-BR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'pt-PT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'qut-GT': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'quz-BO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'quz-EC': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'quz-PE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'rm-CH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ro-mo': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ro-RO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ru-mo': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ru-RU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'rw-RW': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sah-RU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sa-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'se-FI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'se-NO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'se-SE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'si-LK': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sk-SK': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sl-SI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sma-NO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sma-SE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'smj-NO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'smj-SE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'smn-FI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sms-FI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sq-AL': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-BA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-CS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Cyrl-BA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Cyrl-CS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Cyrl-ME': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Cyrl-RS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Latn-BA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Latn-CS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Latn-ME': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-Latn-RS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-ME': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-RS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sr-sp': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sv-FI': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sv-SE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'sw-KE': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'syr-SY': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ta-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'te-IN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tg-Cyrl-TJ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'th-TH': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tk-TM': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tlh-QS': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tn-ZA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tr-TR': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tt-RU': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'tzm-Latn-DZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ug-CN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'uk-UA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'ur-PK': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'uz-Cyrl-UZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'uz-Latn-UZ': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'uz-uz': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'vi-VN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'wo-SN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'xh-ZA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'yo-NG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'zh-CN': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'zh-HK': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'zh-MO': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'zh-SG': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'zh-TW': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
        'zu-ZA': {
          firstDay: 1,
          weekend: [6, 7],
          minimalDays: 4,
        },
      }

      const match =
        weekInfo[locale] ||
        weekInfo[locale.split('-')[0]] ||
        weekInfo['default']

      return {
        firstDay: match?.firstDay,
        weekend: match?.weekend,
        minimalDays: match?.minimalDays,
      }
    }
  }
})()
