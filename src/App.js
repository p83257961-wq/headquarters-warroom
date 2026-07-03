import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  DollarSign,
  Eye,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
  Zap,
  Cloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

/* =========================
   Firebase
========================= */
const firebaseConfig = {
  apiKey: "AIzaSyBGWCKe1mw87g_KRtt-Ar3ffeAExOoYJrg",
  authDomain: "enterprise-e7704.firebaseapp.com",
  projectId: "enterprise-e7704",
  storageBucket: "enterprise-e7704.firebasestorage.app",
  messagingSenderId: "435446255525",
  appId: "1:435446255525:web:2512ca7223e61e2add224c",
};

const fbApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const fbAuth = getAuth(fbApp);
const fbDb = getFirestore(fbApp);

/* =========================
   Constants
========================= */
const STORAGE_KEY = "hq_revenue_warroom_v51_final";
const CLIENT_ID_KEY = "hq_revenue_warroom_v51_client_id";
const FIRESTORE_COLLECTION = "warrooms";
const FIRESTORE_DOC_ID = "hq-revenue-warroom-v51";

const FIXED_CHANNELS = [
  { key: "pos", label: "POS", color: "#FBBF24" },
  { key: "web", label: "網店", color: "#38BDF8" },
  { key: "shopee", label: "蝦皮", color: "#EF4444" },
];

const DEFAULT_DYNAMIC_CHANNELS = ["momo", "other"];
const DEFAULT_AD_CHANNELS = ["shopee", "google", "fb", "momo", "other"];

const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => String(2024 + i));

const MONTH_TABS = [
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
  "1月",
  "2月",
  "3月",
];

const CURRENT_MONTH_TAB = `${new Date().getMonth() + 1}月`;

const WEEKDAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"];

// 會計年度 4月起算：1~3月屬於「前一年度」
const _now = new Date();
const CURRENT_FISCAL_YEAR = String(
  _now.getMonth() + 1 >= 4 ? _now.getFullYear() : _now.getFullYear() - 1
);
const DEFAULT_YEAR = YEAR_OPTIONS.includes(CURRENT_FISCAL_YEAR)
  ? CURRENT_FISCAL_YEAR
  : YEAR_OPTIONS[0];

const PRELOADED_DATA = {
  2024: {
    "3月": {
      adSpend: {
        shopee: 100000,
        google: 129000,
        fb: 74004,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 8005, web: 8325, shopee: 14905, momo: 0, other: 0 },
        { pos: 0, web: 11213, shopee: 8799, momo: 0, other: 0 },
        { pos: 43160, web: 48369, shopee: 30984, momo: 0, other: 0 },
        { pos: 5800, web: 19925, shopee: 5705, momo: 0, other: 0 },
        { pos: 10000, web: 29578, shopee: 10452, momo: 0, other: 0 },
        { pos: 25400, web: 11840, shopee: 3398, momo: 0, other: 0 },
        { pos: 58900, web: 11982, shopee: 8355, momo: 0, other: 0 },
        { pos: 800, web: 18803, shopee: 7749, momo: 0, other: 0 },
        { pos: 0, web: 20366, shopee: 20449, momo: 0, other: 0 },
        { pos: 24440, web: 10261, shopee: 7250, momo: 0, other: 0 },
        { pos: 68775, web: 26115, shopee: 8866, momo: 0, other: 0 },
        { pos: 18335, web: 29125, shopee: 16894, momo: 0, other: 0 },
        { pos: 55150, web: 32525, shopee: 7106, momo: 0, other: 0 },
        { pos: 47700, web: 8481, shopee: 9065, momo: 0, other: 0 },
        { pos: 6000, web: 37550, shopee: 11202, momo: 0, other: 0 },
        { pos: 0, web: 24913, shopee: 13756, momo: 0, other: 0 },
        { pos: 24935, web: 54869, shopee: 21024, momo: 0, other: 0 },
        { pos: 20400, web: 50140, shopee: 52494, momo: 0, other: 0 },
        { pos: 81150, web: 10909, shopee: 8945, momo: 0, other: 0 },
        { pos: 100570, web: 46044, shopee: 13812, momo: 0, other: 0 },
        { pos: 70900, web: 13851, shopee: 19610, momo: 0, other: 0 },
        { pos: 11850, web: 19836, shopee: 9281, momo: 0, other: 0 },
        { pos: 152390, web: 11024, shopee: 20941, momo: 0, other: 0 },
        { pos: 39550, web: 45913, shopee: 16148, momo: 0, other: 0 },
        { pos: 11560, web: 15400, shopee: 17900, momo: 0, other: 0 },
        { pos: 40975, web: 37974, shopee: 18498, momo: 0, other: 0 },
        { pos: 42925, web: 21888, shopee: 25205, momo: 0, other: 0 },
        { pos: 27480, web: 66168, shopee: 8130, momo: 0, other: 0 },
        { pos: 14700, web: 7175, shopee: 11933, momo: 0, other: 0 },
        { pos: 0, web: 10125, shopee: 8862, momo: 0, other: 0 },
        { pos: 81867, web: 37139, shopee: 8933, momo: 0, other: 0 },
      ],
    },
    "2月": {
      adSpend: {
        shopee: 105700,
        google: 113962,
        fb: 81890,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 7235, web: 19790, shopee: 9726, momo: 0, other: 0 },
        { pos: 0, web: 29498, shopee: 17099, momo: 0, other: 0 },
        { pos: 84250, web: 80650, shopee: 17980, momo: 0, other: 0 },
        { pos: 114074, web: 134829, shopee: 22183, momo: 0, other: 0 },
        { pos: 17850, web: 98941, shopee: 14591, momo: 0, other: 0 },
        { pos: 49437, web: 55133, shopee: 6670, momo: 0, other: 0 },
        { pos: 54965, web: 24224, shopee: 10620, momo: 0, other: 0 },
        { pos: 6375, web: 47653, shopee: 17840, momo: 0, other: 0 },
        { pos: 0, web: 12831, shopee: 29222, momo: 0, other: 0 },
        { pos: 0, web: 13865, shopee: 9599, momo: 0, other: 0 },
        { pos: 0, web: 10099, shopee: 7875, momo: 0, other: 0 },
        { pos: 0, web: 7712, shopee: 8877, momo: 0, other: 0 },
        { pos: 0, web: 17108, shopee: 9653, momo: 0, other: 0 },
        { pos: 0, web: 23524, shopee: 8150, momo: 0, other: 0 },
        { pos: 0, web: 9074, shopee: 13366, momo: 0, other: 0 },
        { pos: 0, web: 18981, shopee: 4010, momo: 0, other: 0 },
        { pos: 74340, web: 23027, shopee: 5650, momo: 0, other: 0 },
        { pos: 102200, web: 17363, shopee: 34867, momo: 0, other: 0 },
        { pos: 63900, web: 24839, shopee: 15490, momo: 0, other: 0 },
        { pos: 49500, web: 22521, shopee: 12355, momo: 0, other: 0 },
        { pos: 4550, web: 23832, shopee: 12085, momo: 0, other: 0 },
        { pos: 10760, web: 19479, shopee: 9745, momo: 0, other: 0 },
        { pos: 0, web: 10171, shopee: 12671, momo: 0, other: 0 },
        { pos: 47750, web: 26269, shopee: 3350, momo: 0, other: 0 },
        { pos: 47600, web: 15133, shopee: 12871, momo: 0, other: 0 },
        { pos: 8650, web: 21429, shopee: 5500, momo: 0, other: 0 },
        { pos: 28570, web: 7096, shopee: 12423, momo: 0, other: 0 },
        { pos: 43700, web: 36959, shopee: 7792, momo: 0, other: 0 },
      ],
    },
    "1月": {
      adSpend: {
        shopee: 213400,
        google: 212790,
        fb: 81100,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 38300, web: 40097, shopee: 43423, momo: 0, other: 0 },
        { pos: 155695, web: 58105, shopee: 31582, momo: 0, other: 0 },
        { pos: 39750, web: 24935, shopee: 15190, momo: 0, other: 0 },
        { pos: 33915, web: 34875, shopee: 12515, momo: 0, other: 0 },
        { pos: 0, web: 40849, shopee: 16598, momo: 0, other: 0 },
        { pos: 33675, web: 39652, shopee: 28314, momo: 0, other: 0 },
        { pos: 33500, web: 80413, shopee: 34948, momo: 0, other: 0 },
        { pos: 13250, web: 91858, shopee: 20681, momo: 0, other: 0 },
        { pos: 173832, web: 35714, shopee: 56310, momo: 0, other: 0 },
        { pos: 19650, web: 53703, shopee: 18282, momo: 0, other: 0 },
        { pos: 12685, web: 30914, shopee: 59212, momo: 0, other: 0 },
        { pos: 0, web: 52875, shopee: 57307, momo: 0, other: 0 },
        { pos: 68205, web: 43285, shopee: 42424, momo: 0, other: 0 },
        { pos: 394660, web: 142279, shopee: 22744, momo: 0, other: 0 },
        { pos: 66940, web: 103968, shopee: 68360, momo: 0, other: 0 },
        { pos: 59900, web: 126026, shopee: 27606, momo: 0, other: 0 },
        { pos: 145440, web: 85056, shopee: 31489, momo: 0, other: 0 },
        { pos: 19970, web: 77596, shopee: 51262, momo: 0, other: 0 },
        { pos: 0, web: 110780, shopee: 33566, momo: 0, other: 0 },
        { pos: 297235, web: 77390, shopee: 42165, momo: 0, other: 0 },
        { pos: 59131, web: 93946, shopee: 25368, momo: 0, other: 0 },
        { pos: 175343, web: 65127, shopee: 37677, momo: 0, other: 0 },
        { pos: 38800, web: 40133, shopee: 31422, momo: 0, other: 0 },
        { pos: 27425, web: 110963, shopee: 23332, momo: 0, other: 0 },
        { pos: 31890, web: 72038, shopee: 26105, momo: 0, other: 0 },
        { pos: 0, web: 25187, shopee: 11501, momo: 0, other: 0 },
        { pos: 101650, web: 43380, shopee: 5130, momo: 0, other: 0 },
        { pos: 64264, web: 34610, shopee: 8545, momo: 0, other: 0 },
        { pos: 4011, web: 36957, shopee: 10700, momo: 0, other: 0 },
        { pos: 4400, web: 24528, shopee: 5245, momo: 0, other: 0 },
        { pos: 3700, web: 26092, shopee: 7654, momo: 0, other: 0 },
      ],
    },
    "12月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 0, web: 13526, shopee: 38062, momo: 0, other: 0 },
        { pos: 40350, web: 38032, shopee: 13880, momo: 0, other: 0 },
        { pos: 111740, web: 67358, shopee: 14660, momo: 0, other: 0 },
        { pos: 106600, web: 9564, shopee: 15757, momo: 0, other: 0 },
        { pos: 61815, web: 16746, shopee: 4630, momo: 0, other: 0 },
        { pos: 8300, web: 19617, shopee: 21850, momo: 0, other: 0 },
        { pos: 15200, web: 17753, shopee: 14498, momo: 0, other: 0 },
        { pos: 0, web: 21991, shopee: 3660, momo: 0, other: 0 },
        { pos: 189975, web: 106606, shopee: 8350, momo: 0, other: 0 },
        { pos: 184858, web: 53049, shopee: 12115, momo: 0, other: 0 },
        { pos: 97068, web: 42957, shopee: 28686, momo: 0, other: 0 },
        { pos: 10100, web: 89352, shopee: 59539, momo: 0, other: 0 },
        { pos: 55411, web: 12742, shopee: 15222, momo: 0, other: 0 },
        { pos: 27540, web: 25920, shopee: 20500, momo: 0, other: 0 },
        { pos: 0, web: 31085, shopee: 17557, momo: 0, other: 0 },
        { pos: 106600, web: 57826, shopee: 17447, momo: 0, other: 0 },
        { pos: 27950, web: 63405, shopee: 10739, momo: 0, other: 0 },
        { pos: 15650, web: 26275, shopee: 27157, momo: 0, other: 0 },
        { pos: 21480, web: 9030, shopee: 7948, momo: 0, other: 0 },
        { pos: 44545, web: 42545, shopee: 20195, momo: 0, other: 0 },
        { pos: 7490, web: 35967, shopee: 8338, momo: 0, other: 0 },
        { pos: 0, web: 12916, shopee: 18206, momo: 0, other: 0 },
        { pos: 48995, web: 53431, shopee: 15600, momo: 0, other: 0 },
        { pos: 40200, web: 57851, shopee: 23128, momo: 0, other: 0 },
        { pos: 65400, web: 10951, shopee: 27642, momo: 0, other: 0 },
        { pos: 58525, web: 25924, shopee: 23367, momo: 0, other: 0 },
        { pos: 39800, web: 31415, shopee: 18125, momo: 0, other: 0 },
        { pos: 29050, web: 22744, shopee: 25475, momo: 0, other: 0 },
        { pos: 0, web: 37278, shopee: 29873, momo: 0, other: 0 },
        { pos: 58750, web: 49444, shopee: 24649, momo: 0, other: 0 },
        { pos: 101950, web: 25372, shopee: 50421, momo: 0, other: 0 },
      ],
    },
    "11月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 123040, web: 40165, shopee: 11569, momo: 0, other: 0 },
        { pos: 21300, web: 40862, shopee: 7876, momo: 0, other: 0 },
        { pos: 0, web: 36781, shopee: 31850, momo: 0, other: 0 },
        { pos: 265940, web: 86053, shopee: 2674, momo: 0, other: 0 },
        { pos: 205400, web: 11811, shopee: 6735, momo: 0, other: 0 },
        { pos: 211620, web: 32401, shopee: 11710, momo: 0, other: 0 },
        { pos: 12799, web: 79485, shopee: 6110, momo: 0, other: 0 },
        { pos: 931689, web: 50790, shopee: 4775, momo: 0, other: 0 },
        { pos: 13868, web: 107933, shopee: 9520, momo: 0, other: 0 },
        { pos: 0, web: 70171, shopee: 9285, momo: 0, other: 0 },
        { pos: 98707, web: 213433, shopee: 82378, momo: 0, other: 0 },
        { pos: 22401, web: 10813, shopee: 18307, momo: 0, other: 0 },
        { pos: 164914, web: 3235, shopee: 10496, momo: 0, other: 0 },
        { pos: 8450, web: 9338, shopee: 15460, momo: 0, other: 0 },
        { pos: 138450, web: 13840, shopee: 5195, momo: 0, other: 0 },
        { pos: 55400, web: 26308, shopee: 15206, momo: 0, other: 0 },
        { pos: 0, web: 22927, shopee: 4674, momo: 0, other: 0 },
        { pos: 159950, web: 22937, shopee: 36369, momo: 0, other: 0 },
        { pos: 17100, web: 49521, shopee: 12185, momo: 0, other: 0 },
        { pos: 64800, web: 36689, shopee: 12610, momo: 0, other: 0 },
        { pos: 98525, web: 19282, shopee: 8390, momo: 0, other: 0 },
        { pos: 39700, web: 15445, shopee: 3157, momo: 0, other: 0 },
        { pos: 43000, web: 11885, shopee: 2925, momo: 0, other: 0 },
        { pos: 0, web: 15395, shopee: 15672, momo: 0, other: 0 },
        { pos: 332610, web: 2995, shopee: 19606, momo: 0, other: 0 },
        { pos: 32275, web: 19454, shopee: 6710, momo: 0, other: 0 },
        { pos: 21750, web: 10896, shopee: 16502, momo: 0, other: 0 },
        { pos: 81925, web: 16588, shopee: 5850, momo: 0, other: 0 },
        { pos: 123250, web: 35864, shopee: 11468, momo: 0, other: 0 },
        { pos: 74900, web: 6045, shopee: 16673, momo: 0, other: 0 },
      ],
    },
    "10月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 110200, web: 38163, shopee: 2725, momo: 0, other: 0 },
        { pos: 9125, web: 20040, shopee: 34120, momo: 0, other: 0 },
        { pos: 22300, web: 33327, shopee: 4625, momo: 0, other: 0 },
        { pos: 31600, web: 6385, shopee: 18437, momo: 0, other: 0 },
        { pos: 49790, web: 24658, shopee: 13891, momo: 0, other: 0 },
        { pos: 0, web: 19326, shopee: 19261, momo: 0, other: 0 },
        { pos: 29750, web: 11712, shopee: 6470, momo: 0, other: 0 },
        { pos: 24695, web: 70208, shopee: 10328, momo: 0, other: 0 },
        { pos: 64550, web: 12237, shopee: 12400, momo: 0, other: 0 },
        { pos: 38100, web: 28196, shopee: 37161, momo: 0, other: 0 },
        { pos: 86590, web: 17064, shopee: 2292, momo: 0, other: 0 },
        { pos: 16750, web: 9763, shopee: 4948, momo: 0, other: 0 },
        { pos: 0, web: 20867, shopee: 1150, momo: 0, other: 0 },
        { pos: 90051, web: 2241, shopee: 3875, momo: 0, other: 0 },
        { pos: 80100, web: 55455, shopee: 13380, momo: 0, other: 0 },
        { pos: 68647, web: 17126, shopee: 5579, momo: 0, other: 0 },
        { pos: 49925, web: 9386, shopee: 12680, momo: 0, other: 0 },
        { pos: 155575, web: 46790, shopee: 8614, momo: 0, other: 0 },
        { pos: 77250, web: 6099, shopee: 5100, momo: 0, other: 0 },
        { pos: 0, web: 7991, shopee: 4985, momo: 0, other: 0 },
        { pos: 402650, web: 49375, shopee: 3557, momo: 0, other: 0 },
        { pos: 121000, web: 37891, shopee: 11778, momo: 0, other: 0 },
        { pos: 146340, web: 32300, shopee: 10099, momo: 0, other: 0 },
        { pos: 101210, web: 26698, shopee: 5760, momo: 0, other: 0 },
        { pos: 130740, web: 13090, shopee: 11225, momo: 0, other: 0 },
        { pos: 45565, web: 26575, shopee: 2520, momo: 0, other: 0 },
        { pos: 108000, web: 20038, shopee: 3070, momo: 0, other: 0 },
        { pos: 101400, web: 29670, shopee: 4225, momo: 0, other: 0 },
        { pos: 101850, web: 33140, shopee: 5865, momo: 0, other: 0 },
        { pos: 210000, web: 18234, shopee: 7700, momo: 0, other: 0 },
        { pos: 16975, web: 14641, shopee: 1809, momo: 0, other: 0 },
      ],
    },
    "9月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 0, web: 38884, shopee: 8941, momo: 0, other: 0 },
        { pos: 167710, web: 29576, shopee: 17285, momo: 0, other: 0 },
        { pos: 43740, web: 12140, shopee: 11440, momo: 0, other: 0 },
        { pos: 83620, web: 21692, shopee: 9175, momo: 0, other: 0 },
        { pos: 48525, web: 49717, shopee: 8500, momo: 0, other: 0 },
        { pos: 31725, web: 73668, shopee: 7100, momo: 0, other: 0 },
        { pos: 4150, web: 6058, shopee: 17770, momo: 0, other: 0 },
        { pos: 0, web: 29562, shopee: 20025, momo: 0, other: 0 },
        { pos: 14880, web: 21916, shopee: 29054, momo: 0, other: 0 },
        { pos: 28830, web: 49789, shopee: 21386, momo: 0, other: 0 },
        { pos: 7475, web: 49161, shopee: 8801, momo: 0, other: 0 },
        { pos: 51650, web: 33538, shopee: 1375, momo: 0, other: 0 },
        { pos: 31300, web: 23437, shopee: 6083, momo: 0, other: 0 },
        { pos: 8903, web: 39809, shopee: 1450, momo: 0, other: 0 },
        { pos: 0, web: 28068, shopee: 14442, momo: 0, other: 0 },
        { pos: 26500, web: 20155, shopee: 8580, momo: 0, other: 0 },
        { pos: 15900, web: 36017, shopee: 5047, momo: 0, other: 0 },
        { pos: 37900, web: 35850, shopee: 6143, momo: 0, other: 0 },
        { pos: 28960, web: 26121, shopee: 2300, momo: 0, other: 0 },
        { pos: 43750, web: 23751, shopee: 7285, momo: 0, other: 0 },
        { pos: 15775, web: 6534, shopee: 8287, momo: 0, other: 0 },
        { pos: 0, web: 8740, shopee: 10220, momo: 0, other: 0 },
        { pos: 0, web: 35891, shopee: 3850, momo: 0, other: 0 },
        { pos: 0, web: 3785, shopee: 3660, momo: 0, other: 0 },
        { pos: 0, web: 7507, shopee: 14440, momo: 0, other: 0 },
        { pos: 0, web: 0, shopee: 6422, momo: 0, other: 0 },
        { pos: 0, web: 9472, shopee: 4469, momo: 0, other: 0 },
        { pos: 0, web: 18669, shopee: 6130, momo: 0, other: 0 },
        { pos: 0, web: 11452, shopee: 4893, momo: 0, other: 0 },
        { pos: 147475, web: 24911, shopee: 7634, momo: 0, other: 0 },
      ],
    },
    "8月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 25420, web: 52683, shopee: 6905, momo: 0, other: 0 },
        { pos: 22924, web: 24413, shopee: 11815, momo: 0, other: 0 },
        { pos: 22550, web: 11821, shopee: 15460, momo: 0, other: 0 },
        { pos: 0, web: 24473, shopee: 6159, momo: 0, other: 0 },
        { pos: 40862, web: 69736, shopee: 9285, momo: 0, other: 0 },
        { pos: 48064, web: 53379, shopee: 14626, momo: 0, other: 0 },
        { pos: 420117, web: 43246, shopee: 23225, momo: 0, other: 0 },
        { pos: 38113, web: 94310, shopee: 36509, momo: 0, other: 0 },
        { pos: 31650, web: 34828, shopee: 6592, momo: 0, other: 0 },
        { pos: 23700, web: 36475, shopee: 2500, momo: 0, other: 0 },
        { pos: 0, web: 13135, shopee: 3185, momo: 0, other: 0 },
        { pos: 45315, web: 18672, shopee: 14142, momo: 0, other: 0 },
        { pos: 23800, web: 6571, shopee: 3160, momo: 0, other: 0 },
        { pos: 45750, web: 59858, shopee: 3674, momo: 0, other: 0 },
        { pos: 42980, web: 17237, shopee: 7128, momo: 0, other: 0 },
        { pos: 72800, web: 36421, shopee: 7450, momo: 0, other: 0 },
        { pos: 51200, web: 8140, shopee: 17775, momo: 0, other: 0 },
        { pos: 0, web: 4518, shopee: 35227, momo: 0, other: 0 },
        { pos: 31970, web: 38445, shopee: 5550, momo: 0, other: 0 },
        { pos: 24225, web: 39340, shopee: 1760, momo: 0, other: 0 },
        { pos: 17065, web: 47593, shopee: 6505, momo: 0, other: 0 },
        { pos: 4970, web: 11325, shopee: 8626, momo: 0, other: 0 },
        { pos: 18200, web: 39315, shopee: 3900, momo: 0, other: 0 },
        { pos: 22065, web: 40253, shopee: 3462, momo: 0, other: 0 },
        { pos: 0, web: 15869, shopee: 8847, momo: 0, other: 0 },
        { pos: 52150, web: 23147, shopee: 9195, momo: 0, other: 0 },
        { pos: 83500, web: 24559, shopee: 25360, momo: 0, other: 0 },
        { pos: 20100, web: 2430, shopee: 11500, momo: 0, other: 0 },
        { pos: 4180, web: 87868, shopee: 15595, momo: 0, other: 0 },
        { pos: 15560, web: 27198, shopee: 9451, momo: 0, other: 0 },
        { pos: 17960, web: 25486, shopee: 5565, momo: 0, other: 0 },
      ],
    },
    "7月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 112240, web: 46333, shopee: 6892, momo: 0, other: 0 },
        { pos: 48900, web: 3180, shopee: 5040, momo: 0, other: 0 },
        { pos: 62600, web: 22399, shopee: 8394, momo: 0, other: 0 },
        { pos: 146850, web: 17317, shopee: 11950, momo: 0, other: 0 },
        { pos: 26100, web: 9900, shopee: 3150, momo: 0, other: 0 },
        { pos: 6200, web: 10548, shopee: 12929, momo: 0, other: 0 },
        { pos: 0, web: 18494, shopee: 26305, momo: 0, other: 0 },
        { pos: 73400, web: 24970, shopee: 900, momo: 0, other: 0 },
        { pos: 40950, web: 18937, shopee: 1450, momo: 0, other: 0 },
        { pos: 21775, web: 15362, shopee: 3333, momo: 0, other: 0 },
        { pos: 39735, web: 7460, shopee: 1550, momo: 0, other: 0 },
        { pos: 16490, web: 32019, shopee: 7304, momo: 0, other: 0 },
        { pos: 9100, web: 14999, shopee: 6269, momo: 0, other: 0 },
        { pos: 4750, web: 16865, shopee: 5244, momo: 0, other: 0 },
        { pos: 80205, web: 15669, shopee: 3423, momo: 0, other: 0 },
        { pos: 75300, web: 1921, shopee: 2850, momo: 0, other: 0 },
        { pos: 46900, web: 24095, shopee: 7390, momo: 0, other: 0 },
        { pos: 9200, web: 34455, shopee: 11538, momo: 0, other: 0 },
        { pos: 21525, web: 10740, shopee: 7334, momo: 0, other: 0 },
        { pos: 4100, web: 93534, shopee: 2070, momo: 0, other: 0 },
        { pos: 0, web: 10304, shopee: 6350, momo: 0, other: 0 },
        { pos: 38055, web: 23101, shopee: 11430, momo: 0, other: 0 },
        { pos: 14075, web: 26157, shopee: 3680, momo: 0, other: 0 },
        { pos: 3180, web: 38834, shopee: 16003, momo: 0, other: 0 },
        { pos: 0, web: 36204, shopee: 17764, momo: 0, other: 0 },
        { pos: 48600, web: 16725, shopee: 7644, momo: 0, other: 0 },
        { pos: 25000, web: 5360, shopee: 1025, momo: 0, other: 0 },
        { pos: 0, web: 17879, shopee: 5110, momo: 0, other: 0 },
        { pos: 33539, web: 4983, shopee: 9830, momo: 0, other: 0 },
        { pos: 52000, web: 38498, shopee: 4400, momo: 0, other: 0 },
        { pos: 72725, web: 13833, shopee: 11457, momo: 0, other: 0 },
      ],
    },
    "6月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 27200, web: 32389, shopee: 6074, momo: 0, other: 0 },
        { pos: 0, web: 20631, shopee: 3892, momo: 0, other: 0 },
        { pos: 168665, web: 33814, shopee: 16305, momo: 0, other: 0 },
        { pos: 73815, web: 25782, shopee: 8630, momo: 0, other: 0 },
        { pos: 90090, web: 21842, shopee: 3500, momo: 0, other: 0 },
        { pos: 211850, web: 14355, shopee: 23902, momo: 0, other: 0 },
        { pos: 115375, web: 53947, shopee: 29279, momo: 0, other: 0 },
        { pos: 133440, web: 18065, shopee: 6821, momo: 0, other: 0 },
        { pos: 0, web: 13260, shopee: 8188, momo: 0, other: 0 },
        { pos: 124850, web: 11084, shopee: 6786, momo: 0, other: 0 },
        { pos: 229420, web: 63261, shopee: 2100, momo: 0, other: 0 },
        { pos: 78125, web: 28768, shopee: 1880, momo: 0, other: 0 },
        { pos: 183320, web: 23210, shopee: 6841, momo: 0, other: 0 },
        { pos: 9500, web: 60582, shopee: 10313, momo: 0, other: 0 },
        { pos: 5600, web: 30845, shopee: 4360, momo: 0, other: 0 },
        { pos: 0, web: 16792, shopee: 6114, momo: 0, other: 0 },
        { pos: 94310, web: 22930, shopee: 6127, momo: 0, other: 0 },
        { pos: 155801, web: 33088, shopee: 31253, momo: 0, other: 0 },
        { pos: 100175, web: 25487, shopee: 14324, momo: 0, other: 0 },
        { pos: 187100, web: 26731, shopee: 2350, momo: 0, other: 0 },
        { pos: 16800, web: 53704, shopee: 4584, momo: 0, other: 0 },
        { pos: 19200, web: 22922, shopee: 14897, momo: 0, other: 0 },
        { pos: 0, web: 7034, shopee: 8510, momo: 0, other: 0 },
        { pos: 142525, web: 32703, shopee: 4250, momo: 0, other: 0 },
        { pos: 40750, web: 15942, shopee: 7366, momo: 0, other: 0 },
        { pos: 38625, web: 8093, shopee: 2994, momo: 0, other: 0 },
        { pos: 46950, web: 4567, shopee: 6834, momo: 0, other: 0 },
        { pos: 51515, web: 10635, shopee: 16595, momo: 0, other: 0 },
        { pos: 29800, web: 10687, shopee: 7470, momo: 0, other: 0 },
        { pos: 0, web: 1755, shopee: 5224, momo: 0, other: 0 },
      ],
    },
    "5月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 35900, web: 22370, shopee: 5143, momo: 0, other: 0 },
        { pos: 65500, web: 6998, shopee: 6900, momo: 0, other: 0 },
        { pos: 98550, web: 21038, shopee: 1510, momo: 0, other: 0 },
        { pos: 45300, web: 6691, shopee: 5290, momo: 0, other: 0 },
        { pos: 0, web: 15655, shopee: 15676, momo: 0, other: 0 },
        { pos: 76100, web: 23625, shopee: 10755, momo: 0, other: 0 },
        { pos: 96350, web: 37590, shopee: 2560, momo: 0, other: 0 },
        { pos: 61200, web: 29495, shopee: 300, momo: 0, other: 0 },
        { pos: 96575, web: 21675, shopee: 4480, momo: 0, other: 0 },
        { pos: 107800, web: 33623, shopee: 8450, momo: 0, other: 0 },
        { pos: 139040, web: 9098, shopee: 10000, momo: 0, other: 0 },
        { pos: 19200, web: 16166, shopee: 1225, momo: 0, other: 0 },
        { pos: 179980, web: 11716, shopee: 16666, momo: 0, other: 0 },
        { pos: 182040, web: 8075, shopee: 9975, momo: 0, other: 0 },
        { pos: 95500, web: 28878, shopee: 3003, momo: 0, other: 0 },
        { pos: 85625, web: 11960, shopee: 1450, momo: 0, other: 0 },
        { pos: 784440, web: 5350, shopee: 6149, momo: 0, other: 0 },
        { pos: 112415, web: 830, shopee: 10029, momo: 0, other: 0 },
        { pos: 26575, web: 23022, shopee: 10030, momo: 0, other: 0 },
        { pos: 136165, web: 57400, shopee: 9925, momo: 0, other: 0 },
        { pos: 232375, web: 10557, shopee: 950, momo: 0, other: 0 },
        { pos: 441925, web: 55631, shopee: 4715, momo: 0, other: 0 },
        { pos: 247240, web: 76313, shopee: 5275, momo: 0, other: 0 },
        { pos: 91025, web: 152329, shopee: 5000, momo: 0, other: 0 },
        { pos: 162050, web: 6329, shopee: 7628, momo: 0, other: 0 },
        { pos: 0, web: 11823, shopee: 5715, momo: 0, other: 0 },
        { pos: 113950, web: 37483, shopee: 11200, momo: 0, other: 0 },
        { pos: 272450, web: 38331, shopee: 500, momo: 0, other: 0 },
        { pos: 242925, web: 17445, shopee: 12541, momo: 0, other: 0 },
        { pos: 164550, web: 8415, shopee: 8634, momo: 0, other: 0 },
        { pos: 324265, web: 14339, shopee: 8738, momo: 0, other: 0 },
      ],
    },
    "4月": {
      adSpend: {
        shopee: 0,
        google: 0,
        fb: 0,
        momo: 0,
        pinkoi: 0,
        panda: 0,
        other: 0,
      },
      daily: [
        { pos: 33700, web: 23563, shopee: 8311, momo: 0, other: 0 },
        { pos: 37500, web: 31613, shopee: 0, momo: 0, other: 0 },
        { pos: 13875, web: 20897, shopee: 2980, momo: 0, other: 0 },
        { pos: 14800, web: 4170, shopee: 11954, momo: 0, other: 0 },
        { pos: 20000, web: 18280, shopee: 7000, momo: 0, other: 0 },
        { pos: 39509, web: 32950, shopee: 1416, momo: 0, other: 0 },
        { pos: 1900, web: 59746, shopee: 14739, momo: 0, other: 0 },
        { pos: 65075, web: 42113, shopee: 1862, momo: 0, other: 0 },
        { pos: 15075, web: 18953, shopee: 10880, momo: 0, other: 0 },
        { pos: 13325, web: 49357, shopee: 3575, momo: 0, other: 0 },
        { pos: 79800, web: 37089, shopee: 4410, momo: 0, other: 0 },
        { pos: 25375, web: 1541, shopee: 2100, momo: 0, other: 0 },
        { pos: 17900, web: 12810, shopee: 300, momo: 0, other: 0 },
        { pos: 8250, web: 30640, shopee: 9750, momo: 0, other: 0 },
        { pos: 62400, web: 31196, shopee: 13550, momo: 0, other: 0 },
        { pos: 24000, web: 11470, shopee: 20460, momo: 0, other: 0 },
        { pos: 9450, web: 16040, shopee: 20600, momo: 0, other: 0 },
        { pos: 41725, web: 7171, shopee: 16359, momo: 0, other: 0 },
        { pos: 44050, web: 36215, shopee: 300, momo: 0, other: 0 },
        { pos: 7800, web: 24131, shopee: 5050, momo: 0, other: 0 },
        { pos: 11475, web: 7100, shopee: 4400, momo: 0, other: 0 },
        { pos: 9800, web: 53867, shopee: 2920, momo: 0, other: 0 },
        { pos: 33050, web: 8035, shopee: 9770, momo: 0, other: 0 },
        { pos: 24250, web: 5930, shopee: 2586, momo: 0, other: 0 },
        { pos: 5850, web: 42502, shopee: 400, momo: 0, other: 0 },
        { pos: 64850, web: 9965, shopee: 4300, momo: 0, other: 0 },
        { pos: 18700, web: 13635, shopee: 2248, momo: 0, other: 0 },
        { pos: 0, web: 18860, shopee: 12320, momo: 0, other: 0 },
        { pos: 29775, web: 17329, shopee: 14460, momo: 0, other: 0 },
        { pos: 35925, web: 18731, shopee: 5320, momo: 0, other: 0 },
      ],
    },
  },
  2025: {
    "2月": {
      adSpend: { shopee: 49762, google: 69014, fb: 57744, momo: 0 },
      daily: [
        { pos: 0, web: 75344, shopee: 27768, momo: 3661, other: 4500 },
        { pos: 89796, web: 109069, shopee: 74623, momo: 2000, other: 0 },
        { pos: 35850, web: 42287, shopee: 26865, momo: 0, other: 0 },
        { pos: 50150, web: 123873, shopee: 19847, momo: 0, other: 0 },
        { pos: 26924, web: 84961, shopee: 31006, momo: 1350, other: 0 },
        { pos: 35965, web: 43923, shopee: 37357, momo: 2080, other: 0 },
        { pos: 41015, web: 53267, shopee: 20450, momo: 0, other: 0 },
        { pos: 3850, web: 60648, shopee: 21009, momo: 0, other: 2190 },
        { pos: 102520, web: 52691, shopee: 31763, momo: 2720, other: 0 },
        { pos: 78075, web: 57649, shopee: 29448, momo: 0, other: 0 },
        { pos: 61500, web: 53965, shopee: 37815, momo: 0, other: 0 },
        { pos: 32075, web: 67506, shopee: 12010, momo: 0, other: 1345 },
        { pos: 106055, web: 33250, shopee: 20409, momo: 0, other: 0 },
        { pos: 39680, web: 5070, shopee: 7480, momo: 0, other: 0 },
        { pos: 0, web: 13705, shopee: 6748, momo: 0, other: 0 },
        { pos: 64185, web: 3000, shopee: 3810, momo: 0, other: 0 },
        { pos: 0, web: 34424, shopee: 6067, momo: 0, other: 0 },
        { pos: 0, web: 26182, shopee: 30916, momo: 0, other: 0 },
        { pos: 4400, web: 10106, shopee: 9030, momo: 0, other: 0 },
        { pos: 16200, web: 36374, shopee: 10379, momo: 3491, other: 0 },
        { pos: 22570, web: 88016, shopee: 8577, momo: 0, other: 0 },
        { pos: 0, web: 59108, shopee: 8370, momo: 0, other: 0 },
        { pos: 0, web: 26699, shopee: 13229, momo: 0, other: 0 },
        { pos: 0, web: 8534, shopee: 20649, momo: 0, other: 0 },
        { pos: 0, web: 13300, shopee: 28016, momo: 0, other: 1350 },
        { pos: 0, web: 11313, shopee: 20900, momo: 0, other: 0 },
        { pos: 0, web: 8203, shopee: 5159, momo: 0, other: 0 },
        { pos: 0, web: 10146, shopee: 4039, momo: 0, other: 600 },
      ],
    },
    "1月": {
      adSpend: { shopee: 69400, google: 80985, fb: 90888, momo: 0, other: 644 },
      daily: [
        { pos: 20199, web: 43090, shopee: 13515, momo: 0, other: 300 },
        { pos: 29750, web: 37931, shopee: 4960, momo: 0, other: 0 },
        { pos: 3875, web: 11627, shopee: 23821, momo: 520, other: 2060 },
        { pos: 0, web: 29064, shopee: 26565, momo: 0, other: 800 },
        { pos: 31525, web: 52051, shopee: 15157, momo: 0, other: 0 },
        { pos: 140075, web: 31102, shopee: 11662, momo: 900, other: 1888 },
        { pos: 29390, web: 40228, shopee: 16106, momo: 300, other: 0 },
        { pos: 192655, web: 71084, shopee: 38805, momo: 0, other: 0 },
        { pos: 68325, web: 22851, shopee: 7700, momo: 0, other: 0 },
        { pos: 25390, web: 36460, shopee: 11736, momo: 0, other: 0 },
        { pos: 0, web: 39523, shopee: 65169, momo: 872, other: 0 },
        { pos: 53500, web: 30709, shopee: 37156, momo: 1360, other: 0 },
        { pos: 41560, web: 65562, shopee: 19407, momo: 900, other: 0 },
        { pos: 98725, web: 92688, shopee: 28986, momo: 0, other: 0 },
        { pos: 14550, web: 90175, shopee: 8590, momo: 0, other: 3770 },
        { pos: 48295, web: 92473, shopee: 34020, momo: 1000, other: 9400 },
        { pos: 71470, web: 49583, shopee: 17330, momo: 3660, other: 1350 },
        { pos: 0, web: 65618, shopee: 62089, momo: 0, other: 0 },
        { pos: 63980, web: 25832, shopee: 16338, momo: 572, other: 0 },
        { pos: 48105, web: 59884, shopee: 17748, momo: 360, other: 0 },
        { pos: 23700, web: 62402, shopee: 4997, momo: 0, other: 1150 },
        { pos: 46935, web: 240148, shopee: 25779, momo: 615, other: 0 },
        { pos: 11400, web: 85190, shopee: 24578, momo: 1675, other: 0 },
        { pos: 16185, web: 55718, shopee: 17636, momo: 670, other: 0 },
        { pos: 0, web: 34830, shopee: 56219, momo: 720, other: 800 },
        { pos: 8200, web: 102150, shopee: 11489, momo: 1320, other: 0 },
        { pos: 47680, web: 49919, shopee: 25929, momo: 360, other: 0 },
        { pos: 37660, web: 59876, shopee: 29498, momo: 1546, other: 0 },
        { pos: 32103, web: 67196, shopee: 27347, momo: 0, other: 0 },
        { pos: 19575, web: 26493, shopee: 28798, momo: 0, other: 2718 },
        { pos: 102925, web: 67351, shopee: 25588, momo: 0, other: 200 },
      ],
    },
    "12月": {
      adSpend: {
        shopee: 138000,
        google: 149340,
        fb: 87293,
        momo: 2537,
        other: 4671,
      },
      daily: [
        { pos: 118772, web: 27746, shopee: 17710, momo: 5207, other: 660 },
        { pos: 20640, web: 69424, shopee: 25805, momo: 0, other: 0 },
        { pos: 268900, web: 66356, shopee: 13635, momo: 0, other: 0 },
        { pos: 49410, web: 75416, shopee: 13089, momo: 1765, other: 0 },
        { pos: 10950, web: 33552, shopee: 19468, momo: 860, other: 0 },
        { pos: 8560, web: 17821, shopee: 25810, momo: 2100, other: 0 },
        { pos: 0, web: 53315, shopee: 7304, momo: 2162, other: 300 },
        { pos: 60080, web: 64037, shopee: 21994, momo: 0, other: 2900 },
        { pos: 66042, web: 41815, shopee: 16896, momo: 0, other: 0 },
        { pos: 103792, web: 111831, shopee: 18808, momo: 700, other: 909 },
        { pos: 52600, web: 92544, shopee: 26574, momo: 3261, other: 1044 },
        { pos: 35255, web: 118183, shopee: 68991, momo: 0, other: 0 },
        { pos: 13885, web: 17575, shopee: 21425, momo: 0, other: 0 },
        { pos: 0, web: 29771, shopee: 8547, momo: 0, other: 0 },
        { pos: 46070, web: 71366, shopee: 19434, momo: 475, other: 0 },
        { pos: 42425, web: 10009, shopee: 14065, momo: 731, other: 0 },
        { pos: 28865, web: 35823, shopee: 8066, momo: 0, other: 0 },
        { pos: 14950, web: 12427, shopee: 14906, momo: 0, other: 390 },
        { pos: 84150, web: 23689, shopee: 13285, momo: 485, other: 750 },
        { pos: 10220, web: 18367, shopee: 7632, momo: 300, other: 0 },
        { pos: 0, web: 23234, shopee: 17587, momo: 2375, other: 0 },
        { pos: 58900, web: 77626, shopee: 17751, momo: 0, other: 1100 },
        { pos: 22055, web: 35936, shopee: 22468, momo: 1495, other: 0 },
        { pos: 95180, web: 6664, shopee: 23828, momo: 0, other: 0 },
        { pos: 17800, web: 27118, shopee: 24550, momo: 0, other: 0 },
        { pos: 99475, web: 77263, shopee: 15828, momo: 0, other: 0 },
        { pos: 52443, web: 40882, shopee: 9910, momo: 0, other: 0 },
        { pos: 0, web: 23346, shopee: 19205, momo: 0, other: 0 },
        { pos: 147100, web: 28012, shopee: 19676, momo: 0, other: 0 },
        { pos: 45765, web: 138085, shopee: 6497, momo: 575, other: 100 },
        { pos: 72660, web: 41657, shopee: 12201, momo: 0, other: 1150 },
      ],
    },
    "11月": {
      adSpend: {
        shopee: 97300,
        google: 100519,
        fb: 71232,
        momo: 1027,
        other: 2001,
      },
      daily: [
        { pos: 209360, web: 16448, shopee: 23076, momo: 0, other: 0 },
        { pos: 0, web: 10461, shopee: 2614, momo: 0, other: 0 },
        { pos: 175405, web: 53879, shopee: 14327, momo: 0, other: 3165 },
        { pos: 45010, web: 28153, shopee: 12829, momo: 0, other: 1350 },
        { pos: 54225, web: 79342, shopee: 18484, momo: 0, other: 0 },
        { pos: 58460, web: 20571, shopee: 9482, momo: 0, other: 1317 },
        { pos: 271915, web: 21625, shopee: 12399, momo: 0, other: 0 },
        { pos: 86177, web: 79168, shopee: 13288, momo: 4060, other: 0 },
        { pos: 0, web: 87878, shopee: 15057, momo: 0, other: 0 },
        { pos: 88981, web: 73334, shopee: 11848, momo: 1980, other: 0 },
        { pos: 102859, web: 253458, shopee: 74750, momo: 2670, other: 2813 },
        { pos: 98095, web: 43592, shopee: 10788, momo: 2484, other: 0 },
        { pos: 51775, web: 26904, shopee: 12541, momo: 821, other: 0 },
        { pos: 297100, web: 23097, shopee: 9996, momo: 0, other: 0 },
        { pos: 95800, web: 28076, shopee: 12657, momo: 0, other: 0 },
        { pos: 0, web: 27438, shopee: 8185, momo: 0, other: 0 },
        { pos: 254175, web: 4389, shopee: 23686, momo: 0, other: 0 },
        { pos: 94245, web: 26186, shopee: 38317, momo: 1140, other: 0 },
        { pos: 18190, web: 20095, shopee: 14840, momo: 0, other: 360 },
        { pos: 105975, web: 41076, shopee: 13778, momo: 0, other: 950 },
        { pos: 26900, web: 32814, shopee: 19488, momo: 0, other: 0 },
        { pos: 60075, web: 19480, shopee: 14217, momo: 0, other: 300 },
        { pos: 0, web: 18761, shopee: 20018, momo: 2986, other: 0 },
        { pos: 59650, web: 58886, shopee: 7688, momo: 400, other: 0 },
        { pos: 84250, web: 20207, shopee: 32487, momo: 245, other: 494 },
        { pos: 58950, web: 61347, shopee: 18851, momo: 2400, other: 0 },
        { pos: 180275, web: 41950, shopee: 22598, momo: 997, other: 0 },
        { pos: 95719, web: 21447, shopee: 22060, momo: 0, other: 0 },
        { pos: 51750, web: 33982, shopee: 19130, momo: 0, other: 1580 },
        { pos: 0, web: 0, shopee: 0, momo: 0, other: 0 },
      ],
    },
    "10月": {
      adSpend: {
        shopee: 57300,
        google: 56891,
        fb: 98153,
        momo: 1855,
        other: 3190,
      },
      daily: [
        { pos: 54950, web: 13658, shopee: 33952, momo: 360, other: 0 },
        { pos: 16095, web: 120053, shopee: 3535, momo: 1980, other: 1050 },
        { pos: 18925, web: 43671, shopee: 4641, momo: 0, other: 0 },
        { pos: 18600, web: 31904, shopee: 3689, momo: 0, other: 0 },
        { pos: 0, web: 54025, shopee: 8053, momo: 10275, other: 0 },
        { pos: 6370, web: 71391, shopee: 12083, momo: 0, other: 0 },
        { pos: 28100, web: 34450, shopee: 14775, momo: 0, other: 0 },
        { pos: 31325, web: 32377, shopee: 9995, momo: 0, other: 0 },
        { pos: 47650, web: 50618, shopee: 9152, momo: 1151, other: 0 },
        { pos: 6200, web: 52209, shopee: 44671, momo: 300, other: 0 },
        { pos: 14450, web: 19366, shopee: 4114, momo: 2255, other: 2413 },
        { pos: 0, web: 30619, shopee: 13375, momo: 1255, other: 0 },
        { pos: 57300, web: 46283, shopee: 5790, momo: 0, other: 0 },
        { pos: 219845, web: 48695, shopee: 11292, momo: 0, other: 0 },
        { pos: 210320, web: 46431, shopee: 19251, momo: 0, other: 0 },
        { pos: 4235, web: 35500, shopee: 4690, momo: 0, other: 0 },
        { pos: 419555, web: 1628, shopee: 15376, momo: 0, other: 0 },
        { pos: 28335, web: 27459, shopee: 22557, momo: 0, other: 0 },
        { pos: 0, web: 27460, shopee: 11087, momo: 0, other: 2500 },
        { pos: 110912, web: 29578, shopee: 11080, momo: 0, other: 0 },
        { pos: 127895, web: 52812, shopee: 20636, momo: 3030, other: 4750 },
        { pos: 41460, web: 25963, shopee: 9497, momo: 2845, other: 0 },
        { pos: 138585, web: 42748, shopee: 4854, momo: 0, other: 0 },
        { pos: 153275, web: 35395, shopee: 7703, momo: 0, other: 850 },
        { pos: 51200, web: 37127, shopee: 20256, momo: 0, other: 0 },
        { pos: 0, web: 29453, shopee: 6138, momo: 0, other: 0 },
        { pos: 119720, web: 20635, shopee: 11207, momo: 0, other: 0 },
        { pos: 60740, web: 2495, shopee: 5929, momo: 0, other: 0 },
        { pos: 508025, web: 16348, shopee: 13053, momo: 571, other: 0 },
        { pos: 51685, web: 42920, shopee: 13431, momo: 835, other: 0 },
        { pos: 56840, web: 96358, shopee: 30937, momo: 0, other: 0 },
      ],
    },
    "9月": {
      adSpend: {
        shopee: 77300,
        google: 94694,
        fb: 100123,
        momo: 7842,
        other: 5558,
      },
      daily: [
        { pos: 46360, web: 36600, shopee: 9125, momo: 4320, other: 0 },
        { pos: 21740, web: 45546, shopee: 12742, momo: 0, other: 3909 },
        { pos: 41000, web: 17150, shopee: 16086, momo: 400, other: 0 },
        { pos: 11550, web: 37180, shopee: 14750, momo: 0, other: 0 },
        { pos: 26635, web: 33893, shopee: 15023, momo: 0, other: 0 },
        { pos: 23800, web: 33509, shopee: 9089, momo: 0, other: 0 },
        { pos: 0, web: 10749, shopee: 10153, momo: 0, other: 560 },
        { pos: 16565, web: 63920, shopee: 20489, momo: 0, other: 0 },
        { pos: 43000, web: 25924, shopee: 45785, momo: 1258, other: 0 },
        { pos: 28890, web: 28085, shopee: 43733, momo: 0, other: 0 },
        { pos: 1600, web: 17723, shopee: 6036, momo: 5470, other: 0 },
        { pos: 5125, web: 11513, shopee: 18394, momo: 11361, other: 0 },
        { pos: 23405, web: 5973, shopee: 11191, momo: 0, other: 0 },
        { pos: 0, web: 46091, shopee: 11275, momo: 0, other: 0 },
        { pos: 30410, web: 31057, shopee: 14746, momo: 0, other: 1559 },
        { pos: 22440, web: 63522, shopee: 44983, momo: 0, other: 0 },
        { pos: 88000, web: 22740, shopee: 8985, momo: 0, other: 0 },
        { pos: 19292, web: 37216, shopee: 30706, momo: 0, other: 0 },
        { pos: 28650, web: 42245, shopee: 19522, momo: 2235, other: 0 },
        { pos: 13513, web: 29429, shopee: 28514, momo: 0, other: 0 },
        { pos: 0, web: 40899, shopee: 16489, momo: 0, other: 0 },
        { pos: 100890, web: 37289, shopee: 25268, momo: 4871, other: 4800 },
        { pos: 102530, web: 47220, shopee: 30007, momo: 2900, other: 1268 },
        { pos: 112865, web: 41407, shopee: 10296, momo: 1700, other: 1456 },
        { pos: 1314, web: 15934, shopee: 24914, momo: 0, other: 0 },
        { pos: 15315, web: 29334, shopee: 19478, momo: 2805, other: 300 },
        { pos: 23825, web: 25918, shopee: 5250, momo: 3315, other: 0 },
        { pos: 0, web: 22933, shopee: 8038, momo: 0, other: 942 },
        { pos: 60505, web: 24090, shopee: 15477, momo: 0, other: 0 },
        { pos: 110330, web: 65100, shopee: 17360, momo: 970, other: 0 },
      ],
    },
    "8月": {
      adSpend: {
        shopee: 76600,
        google: 130054,
        fb: 72994,
        momo: 5529,
        other: 2798,
      },
      daily: [
        { pos: 37513, web: 128141, shopee: 12758, momo: 300, other: 0 },
        { pos: 74950, web: 46019, shopee: 29918, momo: 0, other: 0 },
        { pos: 0, web: 57606, shopee: 28499, momo: 360, other: 1315 },
        { pos: 89885, web: 91098, shopee: 19476, momo: 4780, other: 0 },
        { pos: 20762, web: 59243, shopee: 17297, momo: 0, other: 0 },
        { pos: 71248, web: 62629, shopee: 20985, momo: 735, other: 0 },
        { pos: 38592, web: 52593, shopee: 12899, momo: 0, other: 0 },
        { pos: 83812, web: 23871, shopee: 28464, momo: 0, other: 0 },
        { pos: 15360, web: 12398, shopee: 33189, momo: 2100, other: 0 },
        { pos: 0, web: 7505, shopee: 11644, momo: 1950, other: 0 },
        { pos: 44900, web: 20834, shopee: 13766, momo: 0, other: 720 },
        { pos: 32993, web: 26670, shopee: 13688, momo: 0, other: 0 },
        { pos: 0, web: 5920, shopee: 11144, momo: 0, other: 0 },
        { pos: 23200, web: 20483, shopee: 11641, momo: 0, other: 0 },
        { pos: 58975, web: 49582, shopee: 21599, momo: 0, other: 0 },
        { pos: 4560, web: 10582, shopee: 6103, momo: 0, other: 0 },
        { pos: 0, web: 9386, shopee: 6352, momo: 12125, other: 0 },
        { pos: 0, web: 15784, shopee: 29550, momo: 0, other: 0 },
        { pos: 0, web: 10948, shopee: 10829, momo: 0, other: 0 },
        { pos: 0, web: 26481, shopee: 7185, momo: 0, other: 0 },
        { pos: 0, web: 0, shopee: 11563, momo: 0, other: 0 },
        { pos: 0, web: 14240, shopee: 1035, momo: 0, other: 0 },
        { pos: 0, web: 4246, shopee: 5940, momo: 0, other: 0 },
        { pos: 4000, web: 41054, shopee: 15389, momo: 0, other: 0 },
        { pos: 85275, web: 33502, shopee: 51040, momo: 3260, other: 0 },
        { pos: 75192, web: 45528, shopee: 24492, momo: 2510, other: 0 },
        { pos: 67845, web: 88222, shopee: 10372, momo: 600, other: 0 },
        { pos: 23450, web: 35430, shopee: 18093, momo: 600, other: 0 },
        { pos: 72275, web: 25701, shopee: 9880, momo: 1555, other: 1338 },
        { pos: 100800, web: 28285, shopee: 3825, momo: 0, other: 0 },
        { pos: 0, web: 47636, shopee: 17681, momo: 8550, other: 0 },
      ],
    },
    "7月": {
      adSpend: {
        shopee: 100300,
        google: 119170,
        fb: 74947,
        momo: 3171,
        other: 2443,
      },
      daily: [
        { pos: 79365, web: 8850, shopee: 9496, momo: 1585, other: 3685 },
        { pos: 36500, web: 16772, shopee: 17468, momo: 650, other: 0 },
        { pos: 47950, web: 15645, shopee: 3004, momo: 0, other: 0 },
        { pos: 10800, web: 60684, shopee: 6898, momo: 0, other: 0 },
        { pos: 34000, web: 11755, shopee: 21575, momo: 0, other: 0 },
        { pos: 3200, web: 26486, shopee: 9870, momo: 0, other: 0 },
        { pos: 19775, web: 38602, shopee: 49181, momo: 0, other: 0 },
        { pos: 63560, web: 5600, shopee: 2030, momo: 0, other: 0 },
        { pos: 52400, web: 14075, shopee: 12902, momo: 1515, other: 0 },
        { pos: 33150, web: 20402, shopee: 13800, momo: 0, other: 0 },
        { pos: 127445, web: 45673, shopee: 14977, momo: 0, other: 0 },
        { pos: 11720, web: 47580, shopee: 5579, momo: 575, other: 0 },
        { pos: 0, web: 23819, shopee: 47622, momo: 1650, other: 0 },
        { pos: 45550, web: 31835, shopee: 11256, momo: 0, other: 0 },
        { pos: 80436, web: 28969, shopee: 18032, momo: 0, other: 0 },
        { pos: 32750, web: 28240, shopee: 10647, momo: 4950, other: 0 },
        { pos: 12710, web: 6030, shopee: 20254, momo: 0, other: 0 },
        { pos: 39840, web: 28924, shopee: 41929, momo: 0, other: 0 },
        { pos: 5600, web: 20081, shopee: 7120, momo: 0, other: 0 },
        { pos: 0, web: 15067, shopee: 26491, momo: 4540, other: 0 },
        { pos: 33050, web: 59103, shopee: 18447, momo: 0, other: 0 },
        { pos: 21290, web: 34424, shopee: 30432, momo: 0, other: 0 },
        { pos: 37525, web: 15291, shopee: 11980, momo: 3782, other: 0 },
        { pos: 33825, web: 29758, shopee: 11264, momo: 480, other: 0 },
        { pos: 61925, web: 22637, shopee: 21301, momo: 9300, other: 0 },
        { pos: 19150, web: 16076, shopee: 9656, momo: 0, other: 0 },
        { pos: 0, web: 24456, shopee: 8907, momo: 0, other: 0 },
        { pos: 19790, web: 46027, shopee: 15737, momo: 0, other: 0 },
        { pos: 15640, web: 49015, shopee: 29289, momo: 0, other: 0 },
        { pos: 29745, web: 15274, shopee: 16457, momo: 6120, other: 0 },
        { pos: 42798, web: 64894, shopee: 17268, momo: 0, other: 0 },
      ],
    },
    "6月": {
      adSpend: { shopee: 101500, google: 119798, fb: 103273, momo: 6515 },
      daily: [
        { pos: 0, web: 12490, shopee: 13684, momo: 0, other: 0 },
        { pos: 150360, web: 72135, shopee: 24671, momo: 0, other: 0 },
        { pos: 539998, web: 108708, shopee: 36664, momo: 0, other: 0 },
        { pos: 129260, web: 66491, shopee: 28057, momo: 4292, other: 0 },
        { pos: 107525, web: 17492, shopee: 16844, momo: 0, other: 0 },
        { pos: 368375, web: 97826, shopee: 27664, momo: 1440, other: 0 },
        { pos: 3515, web: 14334, shopee: 5036, momo: 0, other: 0 },
        { pos: 0, web: 26820, shopee: 10094, momo: 600, other: 0 },
        { pos: 93789, web: 47951, shopee: 4706, momo: 0, other: 0 },
        { pos: 270450, web: 14584, shopee: 13121, momo: 0, other: 0 },
        { pos: 227740, web: 19685, shopee: 16119, momo: 3022, other: 0 },
        { pos: 20855, web: 64837, shopee: 9992, momo: 0, other: 0 },
        { pos: 34834, web: 17434, shopee: 8570, momo: 0, other: 0 },
        { pos: 81455, web: 33395, shopee: 11838, momo: 2145, other: 0 },
        { pos: 0, web: 23725, shopee: 25079, momo: 2149, other: 0 },
        { pos: 260584, web: 56782, shopee: 8586, momo: 4150, other: 0 },
        { pos: 80217, web: 29415, shopee: 5810, momo: 0, other: 0 },
        { pos: 69286, web: 85382, shopee: 67511, momo: 2303, other: 0 },
        { pos: 34225, web: 16010, shopee: 17369, momo: 0, other: 0 },
        { pos: 3460, web: 11628, shopee: 12108, momo: 0, other: 0 },
        { pos: 201875, web: 17080, shopee: 15450, momo: 0, other: 0 },
        { pos: 0, web: 11450, shopee: 15075, momo: 0, other: 2315 },
        { pos: 44400, web: 58788, shopee: 27958, momo: 0, other: 0 },
        { pos: 61845, web: 23790, shopee: 22214, momo: 3700, other: 0 },
        { pos: 33375, web: 7705, shopee: 28302, momo: 5540, other: 0 },
        { pos: 119370, web: 61382, shopee: 11088, momo: 0, other: 0 },
        { pos: 66825, web: 10880, shopee: 15975, momo: 0, other: 0 },
        { pos: 24850, web: 21203, shopee: 18877, momo: 0, other: 0 },
        { pos: 0, web: 60906, shopee: 25198, momo: 2800, other: 0 },
        { pos: 41265, web: 46902, shopee: 26160, momo: 0, other: 0 },
      ],
    },
    "5月": {
      adSpend: { shopee: 188183, google: 140227, fb: 95212, momo: 0 },
      daily: [
        { pos: 42995, web: 39014, shopee: 22110, momo: 0, other: 0 },
        { pos: 69225, web: 42031, shopee: 28145, momo: 0, other: 0 },
        { pos: 4850, web: 25169, shopee: 18245, momo: 0, other: 0 },
        { pos: 0, web: 21308, shopee: 23306, momo: 300, other: 0 },
        { pos: 40550, web: 32725, shopee: 42459, momo: 704, other: 0 },
        { pos: 60845, web: 25795, shopee: 32115, momo: 800, other: 0 },
        { pos: 21960, web: 27095, shopee: 39147, momo: 6400, other: 0 },
        { pos: 133400, web: 26871, shopee: 26055, momo: 1160, other: 0 },
        { pos: 31025, web: 32010, shopee: 26241, momo: 600, other: 0 },
        { pos: 26890, web: 23500, shopee: 16073, momo: 0, other: 0 },
        { pos: 0, web: 41252, shopee: 31686, momo: 880, other: 0 },
        { pos: 24300, web: 44926, shopee: 4303, momo: 0, other: 0 },
        { pos: 89130, web: 32460, shopee: 39889, momo: 600, other: 0 },
        { pos: 52230, web: 10156, shopee: 27927, momo: 0, other: 0 },
        { pos: 86560, web: 12049, shopee: 17946, momo: 0, other: 0 },
        { pos: 47275, web: 30235, shopee: 27185, momo: 0, other: 0 },
        { pos: 19160, web: 15575, shopee: 8491, momo: 0, other: 0 },
        { pos: 0, web: 17373, shopee: 31396, momo: 0, other: 0 },
        { pos: 293940, web: 42472, shopee: 28377, momo: 500, other: 0 },
        { pos: 636645, web: 52528, shopee: 12541, momo: 300, other: 0 },
        { pos: 101050, web: 35504, shopee: 17681, momo: 8150, other: 0 },
        { pos: 92760, web: 20292, shopee: 15536, momo: 0, other: 0 },
        { pos: 55925, web: 64098, shopee: 12467, momo: 0, other: 6460 },
        { pos: 3900, web: 15075, shopee: 5536, momo: 0, other: 0 },
        { pos: 0, web: 16141, shopee: 21464, momo: 0, other: 0 },
        { pos: 171525, web: 29651, shopee: 15310, momo: 2324, other: 0 },
        { pos: 156985, web: 55442, shopee: 13599, momo: 0, other: 0 },
        { pos: 357760, web: 12740, shopee: 11532, momo: 0, other: 0 },
        { pos: 507360, web: 14921, shopee: 7670, momo: 0, other: 0 },
        { pos: 23535, web: 24041, shopee: 16668, momo: 0, other: 0 },
        { pos: 5925, web: 34157, shopee: 21168, momo: 0, other: 0 },
      ],
    },
    "4月": {
      adSpend: { shopee: 229500, google: 163233, fb: 85904, momo: 0 },
      daily: [
        { pos: 44900, web: 52124, shopee: 13319, momo: 1725, other: 0 },
        { pos: 65495, web: 11890, shopee: 17359, momo: 0, other: 0 },
        { pos: 68920, web: 0, shopee: 9763, momo: 0, other: 0 },
        { pos: 14855, web: 16230, shopee: 30140, momo: 0, other: 0 },
        { pos: 30250, web: 22035, shopee: 10370, momo: 2250, other: 0 },
        { pos: 0, web: 26664, shopee: 7040, momo: 0, other: 0 },
        { pos: 31075, web: 20817, shopee: 4184, momo: 0, other: 2550 },
        { pos: 21580, web: 27088, shopee: 13562, momo: 1650, other: 0 },
        { pos: 11850, web: 11793, shopee: 26095, momo: 0, other: 0 },
        { pos: 24320, web: 40310, shopee: 14145, momo: 2010, other: 0 },
        { pos: 20722, web: 30507, shopee: 4385, momo: 0, other: 0 },
        { pos: 980, web: 12746, shopee: 14512, momo: 0, other: 0 },
        { pos: 0, web: 22169, shopee: 29658, momo: 2000, other: 0 },
        { pos: 125600, web: 8165, shopee: 22747, momo: 2675, other: 0 },
        { pos: 65610, web: 45524, shopee: 10367, momo: 2000, other: 0 },
        { pos: 97180, web: 17527, shopee: 24162, momo: 0, other: 0 },
        { pos: 17710, web: 27867, shopee: 16097, momo: 0, other: 0 },
        { pos: 54425, web: 27822, shopee: 35141, momo: 0, other: 0 },
        { pos: 3605, web: 16818, shopee: 10680, momo: 0, other: 0 },
        { pos: 0, web: 19239, shopee: 30797, momo: 2000, other: 0 },
        { pos: 12800, web: 22519, shopee: 18035, momo: 5300, other: 2171 },
        { pos: 52530, web: 28415, shopee: 8438, momo: 1300, other: 0 },
        { pos: 74050, web: 55322, shopee: 15340, momo: 0, other: 0 },
        { pos: 35225, web: 20193, shopee: 22289, momo: 2600, other: 0 },
        { pos: 13654, web: 52450, shopee: 30082, momo: 0, other: 0 },
        { pos: 4340, web: 9390, shopee: 14545, momo: 2000, other: 0 },
        { pos: 0, web: 11698, shopee: 16387, momo: 650, other: 1909 },
        { pos: 35195, web: 23790, shopee: 22073, momo: 0, other: 0 },
        { pos: 15130, web: 29313, shopee: 25395, momo: 0, other: 0 },
        { pos: 193925, web: 35729, shopee: 20142, momo: 2750, other: 2817 },
      ],
    },
  },
};

const BASE_TREND = [
  { month: "4月", target: 2100000, lastYear: 1800000 },
  { month: "5月", target: 6250000, lastYear: 5710000 },
  { month: "6月", target: 3650000, lastYear: 3840000 },
  { month: "7月", target: 2620000, lastYear: 2140000 },
  { month: "8月", target: 2920000, lastYear: 2570000 },
  { month: "9月", target: 2350000, lastYear: 2060000 },
  { month: "10月", target: 3893000, lastYear: 3539000 },
  { month: "11月", target: 5395000, lastYear: 3956000 },
  { month: "12月", target: 3675419, lastYear: 3330000 },
  { month: "1月", target: 5450000, lastYear: 5010000 },
  { month: "2月", target: 2250000, lastYear: 2140000 },
  { month: "3月", target: 2560000, lastYear: 2350000 },
];

const LABELS = {
  pos: "POS",
  web: "網店",
  shopee: "蝦皮",
  momo: "MOMO",
  other: "其他",
  fb: "FB/IG",
  google: "Google",
};

// 通路色票：深淺色各一套（淺色版沿用暖色調低飽和色，深色版用高對比亮色）
const CHANNEL_COLORS = {
  dark: {
    pos: "#FBBF24",
    web: "#38BDF8",
    shopee: "#EF4444",
    momo: "#A78BFA",
    other: "#8FA3BE",
    fb: "#3B82F6",
    google: "#10B981",
  },
  light: {
    pos: "#8A6A2E",
    web: "#4A7FA5",
    shopee: "#A63228",
    momo: "#6B5B8A",
    other: "#77777D",
    fb: "#4A7FA5",
    google: "#2D6A4F",
  },
};
const CHANNEL_FALLBACK = {
  dark: ["#38BDF8", "#A78BFA", "#FBBF24", "#10B981"],
  light: ["#4A7FA5", "#6B5B8A", "#8A6A2E", "#2D6A4F"],
};

/* =========================
   Helpers
========================= */
const n = (v) => {
  const x = Number(
    String(v ?? "")
      .replace(/,/g, "")
      .trim()
  );
  return Number.isFinite(x) ? x : 0;
};

const money = (v) =>
  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(Number(v || 0));

const num = (v) =>
  new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(
    Number(v || 0)
  );

const labelOf = (k) => LABELS[k] || k;
const colorOf = (k, i = 0, theme = "dark") => {
  const palette = CHANNEL_COLORS[theme] || CHANNEL_COLORS.dark;
  const fallback = CHANNEL_FALLBACK[theme] || CHANNEL_FALLBACK.dark;
  return palette[k] || fallback[i % fallback.length];
};

function getClientId() {
  const existing = localStorage.getItem(CLIENT_ID_KEY);
  if (existing) return existing;
  const id =
    "client_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem(CLIENT_ID_KEY, id);
  return id;
}

// 會計月份 → 實際日曆年月（4月起算，1~3月落在次一日曆年）
function getCalendarYearMonth(year, monthTab) {
  const monthIndex = MONTH_TABS.indexOf(monthTab);
  const calendarMonth = monthIndex < 9 ? monthIndex + 4 : monthIndex - 8;
  const calendarYear =
    monthIndex < 9 ? Number(year) : Number(year) + 1;
  return { calendarYear, calendarMonth };
}

function getDaysInMonth(year, monthTab) {
  const { calendarYear, calendarMonth } = getCalendarYearMonth(year, monthTab);
  return new Date(calendarYear, calendarMonth, 0).getDate();
}

// 加總某月份在指定日期區間內的全通路營收
function sumMonthRange(monthState, startDay, endDay) {
  if (!monthState) return 0;
  const chs = [
    ...FIXED_CHANNELS.map((c) => c.key),
    ...(monthState.dynamicChannels || []),
  ];
  return (monthState.rows || [])
    .filter((r) => r.day >= startDay && r.day <= endDay)
    .reduce((s, row) => s + chs.reduce((rs, k) => rs + n(row[k]), 0), 0);
}

function buildMonthState(year, month) {
  const monthly = PRELOADED_DATA?.[year]?.[month] || { daily: [], adSpend: {} };
  const rows = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    ...(monthly.daily?.[i] || {}),
  }));
  const dynamicChannels = Array.from(
    new Set(
      rows
        .flatMap((r) => Object.keys(r))
        .filter(
          (k) => !["day", ...FIXED_CHANNELS.map((c) => c.key)].includes(k)
        )
    )
  );
  if (!dynamicChannels.length) {
    DEFAULT_DYNAMIC_CHANNELS.forEach((k) => dynamicChannels.push(k));
  }
  const adChannels = Array.from(
    new Set([...DEFAULT_AD_CHANNELS, ...Object.keys(monthly.adSpend || {})])
  );
  return {
    rows: rows.map((row) => {
      const next = { day: row.day };
      [...FIXED_CHANNELS.map((c) => c.key), ...dynamicChannels].forEach((k) => {
        next[k] = row[k] ? String(row[k]) : "";
      });
      return next;
    }),
    dynamicChannels,
    adChannels,
    adSpend: Object.fromEntries(
      adChannels.map((k) => [
        k,
        monthly.adSpend?.[k] ? String(monthly.adSpend[k]) : "",
      ])
    ),
    orderOverrides: {},
  };
}

function buildYearState(year) {
  return Object.fromEntries(
    MONTH_TABS.map((m) => [m, buildMonthState(year, m)])
  );
}

function buildAllYears() {
  return Object.fromEntries(
    YEAR_OPTIONS.map((year) => [year, buildYearState(year)])
  );
}

function sanitizeMonthState(monthState) {
  const safe = monthState || {};
  return {
    rows: Array.isArray(safe.rows)
      ? safe.rows
      : Array.from({ length: 31 }, (_, i) => ({ day: i + 1 })),
    dynamicChannels: Array.isArray(safe.dynamicChannels)
      ? safe.dynamicChannels
      : [...DEFAULT_DYNAMIC_CHANNELS],
    adChannels: Array.isArray(safe.adChannels)
      ? safe.adChannels
      : [...DEFAULT_AD_CHANNELS],
    adSpend:
      safe.adSpend && typeof safe.adSpend === "object" ? safe.adSpend : {},
    orderOverrides:
      safe.orderOverrides && typeof safe.orderOverrides === "object"
        ? safe.orderOverrides
        : {},
  };
}

function sanitizeAllYears(data) {
  const fallback = buildAllYears();
  if (!data || typeof data !== "object") return fallback;
  const result = { ...fallback };
  YEAR_OPTIONS.forEach((year) => {
    const yearData = data[year];
    if (!yearData || typeof yearData !== "object") return;
    result[year] = { ...fallback[year] };
    MONTH_TABS.forEach((month) => {
      result[year][month] = sanitizeMonthState(
        yearData[month] || fallback[year][month]
      );
    });
  });
  return result;
}

// 判斷單一月份是否含有任何使用者資料（非空白骨架）
function monthHasData(monthState) {
  if (!monthState) return false;
  if (
    (monthState.rows || []).some((r) =>
      Object.keys(r).some(
        (k) => k !== "day" && String(r[k] ?? "").trim() !== ""
      )
    )
  )
    return true;
  if (
    Object.values(monthState.adSpend || {}).some(
      (v) => String(v ?? "").trim() !== ""
    )
  )
    return true;
  if (
    Object.values(monthState.orderOverrides || {}).some(
      (v) => String(v ?? "").trim() !== ""
    )
  )
    return true;
  if (
    (monthState.dynamicChannels || []).join(",") !==
    DEFAULT_DYNAMIC_CHANNELS.join(",")
  )
    return true;
  if (
    (monthState.adChannels || []).join(",") !== DEFAULT_AD_CHANNELS.join(",")
  )
    return true;
  return false;
}

// 儲存前裁掉「完全空白的年度／月份」，大幅縮小 Firestore 文件與 localStorage 體積。
// 讀回時 sanitizeAllYears 會用預設骨架補齊，資料不會遺失。
// 有預載資料的年度一律完整保留（避免使用者清除預載值後被還原）。
function pruneAllYears(all) {
  const out = {};
  Object.keys(all || {}).forEach((year) => {
    const months = all[year] || {};
    if (PRELOADED_DATA[year]) {
      out[year] = months;
      return;
    }
    const kept = {};
    MONTH_TABS.forEach((m) => {
      if (monthHasData(months[m])) kept[m] = months[m];
    });
    if (Object.keys(kept).length) out[year] = kept;
  });
  return out;
}

/* =========================
   Small Components
========================= */
function SyncBadge({ syncState, lastSyncedAt }) {
  const meta = {
    idle: { icon: Cloud, text: "雲端同步已啟用", cls: "sync-idle" },
    syncing: {
      icon: Loader2,
      text: "同步中...",
      cls: "sync-syncing",
      spin: true,
    },
    synced: { icon: CheckCircle2, text: "已同步", cls: "sync-synced" },
    error: { icon: AlertTriangle, text: "同步失敗", cls: "sync-error" },
  }[syncState] || { icon: Cloud, text: "雲端同步已啟用", cls: "sync-idle" };
  const Icon = meta.icon;
  return (
    <div
      className={`sync-badge ${meta.cls}`}
      title={lastSyncedAt ? `最後同步：${lastSyncedAt}` : ""}
    >
      <Icon className={meta.spin ? "spin" : ""} size={13} />
      <span>{meta.text}</span>
      {lastSyncedAt ? (
        <span className="sync-time">· {lastSyncedAt}</span>
      ) : null}
    </div>
  );
}

function KPICard({
  title,
  helper,
  value,
  delta,
  tone,
  icon: Icon,
  muted,
  variant = "default",
}) {
  return (
    <div className={`card kpi-card ${variant}`}>
      <div className="kpi-head">
        <div className="icon-box">
          <Icon size={15} />
        </div>
        <div>
          <div className="kpi-title">{title}</div>
          <div className="kpi-helper">{helper}</div>
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-delta ${muted ? "muted" : tone}`}>{delta}</div>
    </div>
  );
}

function TooltipCard({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const actual = (payload.find((p) => p.dataKey === "actual") || {}).value || 0;
  const lastYear =
    (payload.find((p) => p.dataKey === "lastYear") || {}).value || 0;
  const target = (payload.find((p) => p.dataKey === "target") || {}).value || 0;
  const yoy =
    lastYear > 0 ? (((actual - lastYear) / lastYear) * 100).toFixed(1) : "0.0";
  const achieve = target > 0 ? ((actual / target) * 100).toFixed(1) : "0.0";
  const yoyPositive = Number(yoy) >= 0;
  return (
    <div className="tooltip-card">
      <div className="tooltip-month">{label}</div>
      <div className="tooltip-list">
        <div className="tooltip-row">
          <span
            className="tooltip-label-dot"
            style={{ background: "#3B82F6" }}
          />
          <span className="tooltip-label">本年實績</span>
          <strong className="tooltip-val mono">{num(actual)}</strong>
        </div>
        <div className="tooltip-row">
          <span
            className="tooltip-label-dot"
            style={{ background: "#6B7280" }}
          />
          <span className="tooltip-label sec">去年同期</span>
          <span className="tooltip-val mono sec">{num(lastYear)}</span>
        </div>
        <div className="tooltip-yoy-box">
          <span>YoY</span>
          <strong className={yoyPositive ? "yoy-pos" : "yoy-neg"}>
            {yoyPositive ? "+" : ""}
            {yoy}%
          </strong>
        </div>
        {target > 0 && (
          <>
            <div className="tooltip-row">
              <span className="tooltip-label">目標</span>
              <strong className="tooltip-val mono">{num(target)}</strong>
            </div>
            <div className="tooltip-row">
              <span className="tooltip-label">達成率</span>
              <strong className="tooltip-val mono">{achieve}%</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, desc, right }) {
  return (
    <div className="section-header">
      <div>
        <div className="section-title-row">
          <Icon size={15} />
          <h3>{title}</h3>
        </div>
        <p>{desc}</p>
      </div>
      {right}
    </div>
  );
}

/* =========================
   App
========================= */
export default function App() {
  const clientIdRef = useRef(getClientId());
  const hydratedRef = useRef(false);
  const skipNextSaveRef = useRef(false);
  const dirtyRef = useRef(false); // 本機有尚未寫入雲端的變更
  const saveTimerRef = useRef(null);
  const undoStackRef = useRef([]);
  const isUndoingRef = useRef(false);
  const tableRef = useRef(null);

  const [activeYear, setActiveYear] = useState(DEFAULT_YEAR);
  const [activeMonth, setActiveMonth] = useState(
    MONTH_TABS.includes(CURRENT_MONTH_TAB) ? CURRENT_MONTH_TAB : "4月"
  );
  const [allYears, setAllYears] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return sanitizeAllYears(raw ? JSON.parse(raw) : null);
    } catch {
      return buildAllYears();
    }
  });
  const [newRevenueChannel, setNewRevenueChannel] = useState("");
  const [newAdChannel, setNewAdChannel] = useState("");
  const [search, setSearch] = useState("");
  // 日期區間篩選（如 1~10 號、18~28 號）。切換月份/年份時保留，方便同區間比對；
  // rangeEnd 預設 31，換月時會自動夾到該月天數
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(31);
  // 趨勢圖通路篩選："all" 或單一通路 key
  const [trendChannel, setTrendChannel] = useState("all");
  const [targetGrowthRate, setTargetGrowthRate] = useState(() => {
    try {
      return localStorage.getItem("hq_warroom_growth_rate") || "5";
    } catch {
      return "5";
    }
  });
  const [authReady, setAuthReady] = useState(false);
  const [syncState, setSyncState] = useState("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState("");
  const [cloudConnected, setCloudConnected] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("hq_warroom_theme") || "light";
    } catch {
      return "light";
    }
  });
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("hq_warroom_theme", next);
      } catch {}
      return next;
    });
  };

  // data-theme 需掛在 <html> 上，body 背景才會跟著主題切換
  // （修正淺色模式 overscroll 時露出深色底的問題）
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const monthData = allYears[activeYear][activeMonth];
  const loadMonth = (month) => setActiveMonth(month);

  const ensureYearExists = (year) => {
    setAllYears((prev) => {
      if (prev[year]) return prev;
      return { ...prev, [year]: buildYearState(year) };
    });
  };

  useEffect(() => {
    ensureYearExists(activeYear);
  }, [activeYear]);

  // Undo：只快照「被更動的月份」而非整包年度資料，
  // 避免每次輸入都深拷貝全部年度造成卡頓
  const pushUndo = (months) => {
    undoStackRef.current = [
      ...undoStackRef.current.slice(-49),
      { year: activeYear, months: JSON.parse(JSON.stringify(months)) },
    ];
  };

  const updateActiveMonth = (updater) => {
    if (!isUndoingRef.current) pushUndo({ [activeMonth]: monthData });
    dirtyRef.current = true;
    setAllYears((prev) => {
      const safeYear = prev[activeYear] || buildYearState(activeYear);
      return {
        ...prev,
        [activeYear]: {
          ...safeYear,
          [activeMonth]: updater(safeYear[activeMonth]),
        },
      };
    });
  };

  // 通路屬於整個年度：新增／刪除通路時套用到該年度所有月份
  const updateYearMonths = (updater) => {
    if (!isUndoingRef.current)
      pushUndo(allYears[activeYear] || buildYearState(activeYear));
    dirtyRef.current = true;
    setAllYears((prev) => {
      const safeYear = prev[activeYear] || buildYearState(activeYear);
      const nextYear = {};
      MONTH_TABS.forEach((m) => {
        nextYear[m] = updater(safeYear[m]);
      });
      return { ...prev, [activeYear]: nextYear };
    });
  };

  const handleUndo = () => {
    const entry = undoStackRef.current.pop();
    if (!entry) return;
    isUndoingRef.current = true;
    dirtyRef.current = true;
    setAllYears((prev) => {
      const safeYear = prev[entry.year] || buildYearState(entry.year);
      const restored = { ...safeYear };
      Object.keys(entry.months).forEach((m) => {
        restored[m] = sanitizeMonthState(entry.months[m]);
      });
      return { ...prev, [entry.year]: restored };
    });
    // 跳回被復原的年月，讓使用者看得到復原結果
    setActiveYear(entry.year);
    const monthKeys = Object.keys(entry.months);
    if (monthKeys.length === 1) setActiveMonth(monthKeys[0]);
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 50);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const setRowValue = (day, key, value) => {
    updateActiveMonth((prev) => ({
      ...prev,
      rows: prev.rows.map((r) =>
        r.day === day
          ? { ...r, [key]: String(value).replace(/[^0-9]/g, "") }
          : r
      ),
    }));
  };

  const addRevenueChannel = () => {
    const key = newRevenueChannel.trim().toLowerCase();
    if (
      !key ||
      FIXED_CHANNELS.some((c) => c.key === key) ||
      monthData.dynamicChannels.includes(key)
    )
      return;
    updateYearMonths((prev) =>
      prev.dynamicChannels.includes(key)
        ? prev
        : {
            ...prev,
            dynamicChannels: [...prev.dynamicChannels, key],
            rows: prev.rows.map((r) => ({ ...r, [key]: r[key] ?? "" })),
            orderOverrides: { ...(prev.orderOverrides || {}), [key]: "" },
          }
    );
    setNewRevenueChannel("");
  };

  const removeRevenueChannel = (key) => {
    if (
      !window.confirm(
        `確定要刪除通路「${labelOf(
          key
        )}」？將移除 ${activeYear} 年度所有月份的此通路資料（可按 Ctrl+Z 復原）。`
      )
    )
      return;
    updateYearMonths((prev) => {
      if (!prev.dynamicChannels.includes(key)) return prev;
      const nextOverrides = { ...(prev.orderOverrides || {}) };
      delete nextOverrides[key];
      return {
        ...prev,
        dynamicChannels: prev.dynamicChannels.filter((k) => k !== key),
        rows: prev.rows.map((r) => {
          const x = { ...r };
          delete x[key];
          return x;
        }),
        orderOverrides: nextOverrides,
      };
    });
  };

  const setAdSpendValue = (key, value) => {
    updateActiveMonth((prev) => ({
      ...prev,
      adSpend: { ...prev.adSpend, [key]: String(value).replace(/[^0-9]/g, "") },
    }));
  };

  const addAdChannel = () => {
    const key = newAdChannel.trim().toLowerCase();
    if (!key || monthData.adChannels.includes(key)) return;
    updateYearMonths((prev) =>
      prev.adChannels.includes(key)
        ? prev
        : {
            ...prev,
            adChannels: [...prev.adChannels, key],
            adSpend: { ...prev.adSpend, [key]: prev.adSpend?.[key] ?? "" },
          }
    );
    setNewAdChannel("");
  };

  const removeAdChannel = (key) => {
    if (
      !window.confirm(
        `確定要刪除廣告渠道「${labelOf(
          key
        )}」？將移除 ${activeYear} 年度所有月份的此渠道金額（可按 Ctrl+Z 復原）。`
      )
    )
      return;
    updateYearMonths((prev) => {
      const next = { ...prev.adSpend };
      delete next[key];
      return {
        ...prev,
        adSpend: next,
        adChannels: prev.adChannels.filter((k) => k !== key),
      };
    });
  };

  const setOrderOverride = (key, value) => {
    updateActiveMonth((prev) => ({
      ...prev,
      orderOverrides: {
        ...(prev.orderOverrides || {}),
        [key]: String(value).replace(/[^0-9]/g, ""),
      },
    }));
  };

  const changeGrowthRate = (value) => {
    dirtyRef.current = true;
    setTargetGrowthRate(String(value).replace(/[^0-9]/g, ""));
  };

  // Firebase auth
  useEffect(() => {
    let unsub = onAuthStateChanged(fbAuth, async (user) => {
      try {
        if (!user) {
          await signInAnonymously(fbAuth);
          return;
        }
        setAuthReady(true);
        setCloudConnected(true);
      } catch (err) {
        console.error(err);
        setCloudConnected(false);
        setSyncState("error");
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Firestore listener
  // - 忽略本機 pending write 的回音（hasPendingWrites）
  // - 本機有未儲存變更時不套用遠端快照，避免打字中被覆蓋
  useEffect(() => {
    if (!authReady) return;
    const ref = doc(fbDb, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        try {
          if (snap.metadata.hasPendingWrites) return;
          if (!snap.exists()) {
            hydratedRef.current = true;
            setSyncState("idle");
            return;
          }
          const remote = snap.data() || {};
          const isOwnEcho = remote.updatedBy === clientIdRef.current;
          if (hydratedRef.current && isOwnEcho) {
            setSyncState("synced");
            setLastSyncedAt(new Date().toLocaleString("zh-TW"));
            return;
          }
          if (hydratedRef.current && dirtyRef.current) return;
          const remoteYears = sanitizeAllYears(remote.allYears);
          const remoteTargetGrowthRate =
            typeof remote.targetGrowthRate === "string"
              ? remote.targetGrowthRate
              : String(remote.targetGrowthRate || "5");
          skipNextSaveRef.current = true;
          setAllYears(remoteYears);
          setTargetGrowthRate(remoteTargetGrowthRate);
          hydratedRef.current = true;
          setSyncState("synced");
          setLastSyncedAt(new Date().toLocaleString("zh-TW"));
        } catch (err) {
          console.error(err);
          hydratedRef.current = true;
          setSyncState("error");
        }
      },
      (err) => {
        console.error(err);
        hydratedRef.current = true;
        setSyncState("error");
      }
    );
    return () => unsub();
  }, [authReady]);

  // Local storage backup（debounce + 裁掉空白年度，避免每個按鍵全量序列化）
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(pruneAllYears(allYears))
        );
      } catch (err) {
        console.error(err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [allYears]);

  useEffect(() => {
    try {
      localStorage.setItem("hq_warroom_growth_rate", targetGrowthRate);
    } catch {}
  }, [targetGrowthRate]);

  // Firestore save（整份覆寫 + 裁掉空白年度，控制文件大小在 1MiB 上限內）
  useEffect(() => {
    if (!authReady || !hydratedRef.current) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        setSyncState("syncing");
        dirtyRef.current = false;
        const ref = doc(fbDb, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
        await setDoc(ref, {
          allYears: pruneAllYears(allYears),
          targetGrowthRate,
          updatedAt: serverTimestamp(),
          updatedAtClient: new Date().toISOString(),
          updatedBy: clientIdRef.current,
        });
        setSyncState("synced");
        setLastSyncedAt(new Date().toLocaleString("zh-TW"));
      } catch (err) {
        console.error(err);
        dirtyRef.current = true;
        setSyncState("error");
      }
    }, 700);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [allYears, targetGrowthRate, authReady]);

  const currentChannels = [
    ...FIXED_CHANNELS.map((c) => c.key),
    ...monthData.dynamicChannels,
  ];

  const tc = useMemo(
    () =>
      theme === "dark"
        ? {
            gold: "#3B82F6",
            goldDim: "#60A5FA",
            goldGlow: "rgba(59,130,246,0.06)",
            textDim: "#6B7F9E",
            border: "rgba(255,255,255,0.06)",
            bgDeep: "#0D1520",
            green: "#10B981",
          }
        : {
            gold: "#1C1C1E",
            goldDim: "#5C5C60",
            goldGlow: "rgba(28,28,30,0.04)",
            textDim: "#77777D",
            border: "rgba(28,28,30,0.08)",
            bgDeep: "#F7F6F3",
            green: "#2D6A4F",
          },
    [theme]
  );

  const daysInMonth = useMemo(
    () => getDaysInMonth(activeYear, activeMonth),
    [activeYear, activeMonth]
  );

  const effRangeEnd = Math.min(rangeEnd, daysInMonth);
  const effRangeStart = Math.max(1, Math.min(rangeStart, effRangeEnd));
  const isFullRange = effRangeStart === 1 && effRangeEnd === daysInMonth;

  // 當月每一天對應的星期（0=日、6=六）
  const dayWeekdayMap = useMemo(() => {
    const { calendarYear, calendarMonth } = getCalendarYearMonth(
      activeYear,
      activeMonth
    );
    const map = {};
    for (let d = 1; d <= daysInMonth; d++) {
      map[d] = new Date(calendarYear, calendarMonth - 1, d).getDay();
    }
    return map;
  }, [activeYear, activeMonth, daysInMonth]);

  // 只加總「當月實際存在的天數」，避免隱藏列（如 2 月的 29~31 日）被計入
  const totals = useMemo(() => {
    const base = Object.fromEntries(currentChannels.map((k) => [k, 0]));
    monthData.rows
      .filter((r) => r.day <= daysInMonth)
      .forEach((r) => {
        currentChannels.forEach((k) => {
          base[k] += n(r[k]);
        });
      });
    return { ...base, total: currentChannels.reduce((s, k) => s + base[k], 0) };
  }, [monthData.rows, monthData.dynamicChannels, daysInMonth]);

  const chartData = useMemo(() => {
    const factor = 1 + n(targetGrowthRate) / 100;
    const prevYear = String(Number(activeYear) - 1);
    const prevYearState = allYears[prevYear];
    return BASE_TREND.map((item) => {
      const currentState =
        allYears[activeYear]?.[item.month] ||
        buildYearState(activeYear)[item.month];
      const dim = getDaysInMonth(activeYear, item.month);
      const currentCh = [
        ...FIXED_CHANNELS.map((c) => c.key),
        ...currentState.dynamicChannels,
      ];
      const actual = currentState.rows
        .filter((row) => row.day <= dim)
        .reduce(
          (sum, row) =>
            sum + currentCh.reduce((rs, key) => rs + n(row[key]), 0),
          0
        );
      let lastYearActual = item.lastYear;
      if (prevYearState?.[item.month]) {
        const prevState = prevYearState[item.month];
        const prevDim = getDaysInMonth(prevYear, item.month);
        const prevCh = [
          ...FIXED_CHANNELS.map((c) => c.key),
          ...prevState.dynamicChannels,
        ];
        lastYearActual = prevState.rows
          .filter((row) => row.day <= prevDim)
          .reduce(
            (sum, row) =>
              sum + prevCh.reduce((rs, key) => rs + n(row[key]), 0),
            0
          );
      }
      return {
        ...item,
        lastYear: lastYearActual,
        target: Math.round(lastYearActual * factor),
        actual,
      };
    });
  }, [allYears, activeYear, targetGrowthRate]);

  // 該年度出現過的所有通路（趨勢圖通路選單用）
  const yearChannels = useMemo(() => {
    const set = new Set(FIXED_CHANNELS.map((c) => c.key));
    const yearState = allYears[activeYear] || {};
    MONTH_TABS.forEach((m) =>
      (yearState[m]?.dynamicChannels || []).forEach((k) => set.add(k))
    );
    return Array.from(set);
  }, [allYears, activeYear]);

  // 趨勢圖資料：全部通路時沿用 chartData（KPI 也吃它，口徑不變）；
  // 選單一通路時另外計算，目標同樣 = 該通路去年同期 × (1 + 成長率)
  const trendChartData = useMemo(() => {
    if (trendChannel === "all") return chartData;
    const factor = 1 + n(targetGrowthRate) / 100;
    const prevYear = String(Number(activeYear) - 1);
    const prevYearState = allYears[prevYear];
    return BASE_TREND.map((item) => {
      const currentState =
        allYears[activeYear]?.[item.month] ||
        buildYearState(activeYear)[item.month];
      const dim = getDaysInMonth(activeYear, item.month);
      const actual = currentState.rows
        .filter((row) => row.day <= dim)
        .reduce((sum, row) => sum + n(row[trendChannel]), 0);
      let lastYearActual = 0;
      if (prevYearState?.[item.month]) {
        const prevDim = getDaysInMonth(prevYear, item.month);
        lastYearActual = prevYearState[item.month].rows
          .filter((row) => row.day <= prevDim)
          .reduce((sum, row) => sum + n(row[trendChannel]), 0);
      }
      return {
        month: item.month,
        actual,
        lastYear: lastYearActual,
        target: Math.round(lastYearActual * factor),
      };
    });
  }, [chartData, allYears, activeYear, targetGrowthRate, trendChannel]);

  const donutData = useMemo(() => {
    const arr = FIXED_CHANNELS.map((c) => ({
      key: c.key,
      name: c.label,
      value: totals[c.key],
      color: colorOf(c.key, 0, theme),
    }));
    monthData.dynamicChannels.forEach((k, i) => {
      arr.push({
        key: k,
        name: labelOf(k),
        value: totals[k],
        color: colorOf(k, i, theme),
      });
    });
    return arr.filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  }, [monthData.dynamicChannels, totals, theme]);

  const adSpendEntries = useMemo(
    () => monthData.adChannels.map((k) => [k, monthData.adSpend[k] || ""]),
    [monthData.adChannels, monthData.adSpend]
  );

  const currentRevenue = totals.total;
  const currentChart = chartData.find((item) => item.month === activeMonth) || {
    lastYear: 0,
    target: 0,
  };
  const currentTarget = currentChart.target || 0;
  const yoy = currentChart.lastYear
    ? ((currentRevenue - currentChart.lastYear) / currentChart.lastYear) * 100
    : 0;
  const achieveRate = currentTarget
    ? (currentRevenue / currentTarget) * 100
    : 0;

  // YTD 同比：本年與去年都「只計已有實績的月份」，避免拿部分年度對整年比較
  const monthsWithActual = chartData.filter((i) => i.actual > 0);
  const ytd = monthsWithActual.reduce((s, i) => s + i.actual, 0);
  const ytdLastYear = monthsWithActual.reduce(
    (s, i) => s + (i.lastYear || 0),
    0
  );
  const ytdYoY = ytdLastYear ? ((ytd - ytdLastYear) / ytdLastYear) * 100 : 0;
  const annualTarget = chartData.reduce((s, i) => s + i.target, 0);
  // 同期目標（僅已有實績月份的目標加總）→ 用來判斷 AHEAD / ON TRACK / BEHIND
  const ytdTarget = monthsWithActual.reduce((s, i) => s + (i.target || 0), 0);
  const paceRate = ytdTarget ? (ytd / ytdTarget) * 100 : 0;
  const monthsWithRevenue = monthsWithActual.length;
  const projectedAnnual =
    monthsWithRevenue > 0 ? Math.round((ytd / monthsWithRevenue) * 12) : 0;
  const annualRate = annualTarget ? (ytd / annualTarget) * 100 : 0;
  const gapToTarget = currentRevenue - currentTarget;

  const filteredRows = useMemo(() => {
    const validRows = monthData.rows.filter(
      (r) =>
        r.day <= daysInMonth && r.day >= effRangeStart && r.day <= effRangeEnd
    );
    const q = search.trim();
    if (!q) return validRows;
    return validRows.filter((r) => String(r.day) === q);
  }, [monthData.rows, search, daysInMonth, effRangeStart, effRangeEnd]);

  // 區間彙總（各通路）與比對：同區間 vs 去年同月、vs 上一個月
  const rangeTotals = useMemo(() => {
    const base = Object.fromEntries(currentChannels.map((k) => [k, 0]));
    monthData.rows
      .filter((r) => r.day >= effRangeStart && r.day <= effRangeEnd)
      .forEach((r) => {
        currentChannels.forEach((k) => {
          base[k] += n(r[k]);
        });
      });
    return { ...base, total: currentChannels.reduce((s, k) => s + base[k], 0) };
  }, [monthData.rows, monthData.dynamicChannels, effRangeStart, effRangeEnd]);

  const rangeStats = useMemo(() => {
    const prevYearKey = String(Number(activeYear) - 1);
    const lastYearState = allYears[prevYearKey]?.[activeMonth];
    const lastYear = lastYearState
      ? sumMonthRange(
          lastYearState,
          effRangeStart,
          Math.min(effRangeEnd, getDaysInMonth(prevYearKey, activeMonth))
        )
      : 0;
    const idx = MONTH_TABS.indexOf(activeMonth);
    const prevMonthTab = idx === 0 ? MONTH_TABS[11] : MONTH_TABS[idx - 1];
    const prevMonthYear =
      idx === 0 ? String(Number(activeYear) - 1) : activeYear;
    const prevMonthState = allYears[prevMonthYear]?.[prevMonthTab];
    const prevMonth = prevMonthState
      ? sumMonthRange(
          prevMonthState,
          effRangeStart,
          Math.min(effRangeEnd, getDaysInMonth(prevMonthYear, prevMonthTab))
        )
      : 0;
    return { lastYear, prevMonth, prevMonthTab };
  }, [allYears, activeYear, activeMonth, effRangeStart, effRangeEnd]);

  const rangeYoY =
    rangeStats.lastYear > 0
      ? ((rangeTotals.total - rangeStats.lastYear) / rangeStats.lastYear) * 100
      : null;
  const rangeMoM =
    rangeStats.prevMonth > 0
      ? ((rangeTotals.total - rangeStats.prevMonth) / rangeStats.prevMonth) *
        100
      : null;

  // 表格底部總計：全月時顯示月總計，選了區間就顯示區間總計
  const displayTotals = isFullRange ? totals : rangeTotals;

  // 平假日分析：在選定區間內，分別統計平日/週末的日均營收（只計有營收的天）
  const dayTypeStats = useMemo(() => {
    let wdSum = 0,
      wdDays = 0,
      weSum = 0,
      weDays = 0;
    monthData.rows
      .filter((r) => r.day >= effRangeStart && r.day <= effRangeEnd)
      .forEach((r) => {
        const total = currentChannels.reduce((s, k) => s + n(r[k]), 0);
        if (total <= 0) return;
        const wd = dayWeekdayMap[r.day];
        if (wd === 0 || wd === 6) {
          weSum += total;
          weDays++;
        } else {
          wdSum += total;
          wdDays++;
        }
      });
    const avgWeekday = wdDays ? Math.round(wdSum / wdDays) : 0;
    const avgWeekend = weDays ? Math.round(weSum / weDays) : 0;
    const diffPct =
      avgWeekday > 0 && avgWeekend > 0
        ? ((avgWeekend - avgWeekday) / avgWeekday) * 100
        : null;
    return { avgWeekday, avgWeekend, wdDays, weDays, diffPct };
  }, [
    monthData.rows,
    monthData.dynamicChannels,
    effRangeStart,
    effRangeEnd,
    dayWeekdayMap,
  ]);

  // 異常偵測 — 平日/週末分開比較基準（避免正常的週末高峰被誤標「異常高」）；
  // 「無營收」只標記已過去的日期，未來日期不視為異常
  const anomalyFlags = useMemo(() => {
    const { calendarYear, calendarMonth } = getCalendarYearMonth(
      activeYear,
      activeMonth
    );
    const today = new Date();
    const monthStart = new Date(calendarYear, calendarMonth - 1, 1);
    const isCurrentMonth =
      today.getFullYear() === calendarYear &&
      today.getMonth() === calendarMonth - 1;
    const lastFlaggableDay =
      monthStart > today ? 0 : isCurrentMonth ? today.getDate() - 1 : daysInMonth;
    const dailyTotals = monthData.rows
      .filter((r) => r.day <= daysInMonth)
      .map((row) => {
        const wd = dayWeekdayMap[row.day];
        return {
          day: row.day,
          isWeekend: wd === 0 || wd === 6,
          total: currentChannels.reduce((s, k) => s + n(row[k]), 0),
        };
      });
    const withRevenue = dailyTotals.filter((d) => d.total > 0);
    if (withRevenue.length < 3) return {};
    const avgOf = (list) =>
      list.length ? list.reduce((s, d) => s + d.total, 0) / list.length : 0;
    const avgAll = avgOf(withRevenue);
    const weekdayDays = withRevenue.filter((d) => !d.isWeekend);
    const weekendDays = withRevenue.filter((d) => d.isWeekend);
    // 同類型有資料的天數太少時，退回全月平均當基準
    const avgWeekday = weekdayDays.length >= 3 ? avgOf(weekdayDays) : avgAll;
    const avgWeekend = weekendDays.length >= 3 ? avgOf(weekendDays) : avgAll;
    const flags = {};
    dailyTotals.forEach((d) => {
      const base = d.isWeekend ? avgWeekend : avgWeekday;
      if (
        d.total === 0 &&
        d.day <= lastFlaggableDay &&
        withRevenue.length > 5
      ) {
        flags[d.day] = "zero";
      } else if (d.total > base * 2.2) {
        flags[d.day] = "spike";
      } else if (d.total > 0 && d.total < base * 0.3) {
        flags[d.day] = "low";
      }
    });
    return flags;
  }, [
    monthData.rows,
    daysInMonth,
    currentChannels,
    activeYear,
    activeMonth,
    dayWeekdayMap,
  ]);

  const handleCellFocus = (e) => {
    e.target.select();
  };

  const handleCellKeyDown = (e) => {
    if (e.key !== "Tab" && e.key !== "Enter") return;
    const table = tableRef.current;
    if (!table) return;

    const inputs = Array.from(table.querySelectorAll("tbody .cell-input"));
    const idx = inputs.indexOf(e.target);
    if (idx === -1) return;

    const colCount = currentChannels.length;

    if (e.key === "Enter") {
      // Enter → move down (same column, next row)
      const nextIdx = idx + colCount;
      if (nextIdx < inputs.length) {
        e.preventDefault();
        inputs[nextIdx].focus();
      }
    } else if (e.key === "Tab") {
      // 邊界時不攔截，讓瀏覽器自然移出表格
      const target = e.shiftKey ? idx - 1 : idx + 1;
      if (target >= 0 && target < inputs.length) {
        e.preventDefault();
        inputs[target].focus();
      }
    }
  };

  // 訂單數：未填寫時以「營收 ÷ 10,000」推估（以 placeholder 呈現，不冒充實際值），
  // 列表顯示與總計使用同一套邏輯
  const orderInfos = currentChannels.map((key) => {
    const amount = totals[key] || 0;
    const ov = monthData.orderOverrides?.[key];
    const hasOverride = ov !== undefined && String(ov).trim() !== "";
    const estimate = Math.max(Math.round(amount / 10000), 0);
    return {
      key,
      amount,
      hasOverride,
      estimate,
      count: hasOverride ? n(ov) : estimate,
      inputValue: hasOverride ? String(ov) : "",
    };
  });
  const totalOrdersAllChannels = orderInfos.reduce((s, o) => s + o.count, 0);
  const hasEstimatedOrders = orderInfos.some(
    (o) => !o.hasOverride && o.count > 0
  );

  const activeDaysWithRevenue = monthData.rows.filter(
    (row) =>
      row.day <= daysInMonth &&
      currentChannels.reduce((rowSum, key) => rowSum + n(row[key]), 0) > 0
  ).length;

  const avgDailyOrdersAllChannels =
    activeDaysWithRevenue > 0
      ? (totalOrdersAllChannels / activeDaysWithRevenue).toFixed(1)
      : "0.0";
  const avgOrderValueAllChannels =
    totalOrdersAllChannels > 0
      ? `$${num(Math.round(currentRevenue / totalOrdersAllChannels))}`
      : "$0";
  const yoyMuted = currentRevenue === 0;
  const targetMuted = currentRevenue === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,300..800&family=Noto+Sans+TC:wght@400;500;700;900&display=swap');

        :root, [data-theme="dark"] {
          --bg-deep: #0D1520;
          --bg-surface: #131F2E;
          --bg-elevated: #1A2840;
          --bg-hover: #1E2F4A;
          --border: rgba(255,255,255,0.06);
          --border-bright: rgba(255,255,255,0.12);
          --gold: #3B82F6;
          --gold-dim: #60A5FA;
          --gold-glow: rgba(59,130,246,0.12);
          --gold-bright: #60A5FA;
          --text-primary: #E8EFF8;
          --text-secondary: #8FA3BE;
          --text-dim: #6B7F9E;
          --green: #10B981;
          --green-dim: rgba(16,185,129,0.12);
          --red: #EF4444;
          --red-dim: rgba(239,68,68,0.12);
          --blue: #38BDF8;
          --blue-dim: rgba(56,189,248,0.12);
          --shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
          --table-border: rgba(255,255,255,0.05);
        }

        [data-theme="light"] {
          --bg-deep: #F7F6F3;
          --bg-surface: #FFFFFF;
          --bg-elevated: #F2F1EE;
          --bg-hover: #F9F8F6;
          --border: rgba(28,28,30,0.08);
          --border-bright: rgba(28,28,30,0.14);
          --gold: #1C1C1E;
          --gold-dim: #5C5C60;
          --gold-glow: rgba(28,28,30,0.05);
          --gold-bright: #1C1C1E;
          --text-primary: #1C1C1E;
          --text-secondary: #5C5C60;
          --text-dim: #77777D;
          --green: #2D6A4F;
          --green-dim: rgba(45,106,79,0.07);
          --red: #A63228;
          --red-dim: rgba(166,50,40,0.07);
          --blue: #4A7FA5;
          --blue-dim: rgba(74,127,165,0.07);
          --shadow-card: 0 1px 0 rgba(28,28,30,0.06), 0 1px 3px rgba(28,28,30,0.03);
          --table-border: rgba(28,28,30,0.06);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: var(--bg-deep);
          color: var(--text-primary);
          font-family: 'DM Sans', 'Noto Sans TC', -apple-system, sans-serif;
        }
        button, input, select { font: inherit; }

        .mono { font-family: 'DM Mono', monospace; }

        .app { min-height: 100vh; background: var(--bg-deep); }
        .container { max-width: 1580px; margin: 0 auto; padding: 24px; }

        /* ── Topbar ── */
        .topbar {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          gap: 20px;
          align-items: end;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .page-title {
          margin: 10px 0 0;
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          line-height: 1.05;
        }
        .page-subtitle {
          margin-top: 8px;
          color: var(--text-dim);
          font-size: 14px;
          font-family: 'DM Mono', monospace;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .selector-box {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 14px;
          min-width: 132px;
        }
        .selector-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          color: var(--text-dim);
          margin-bottom: 6px;
        }
        .selector-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .selector-row select {
          border: none;
          outline: none;
          background: transparent;
          font-weight: 700;
          color: var(--gold);
          font-family: 'DM Mono', monospace;
          cursor: pointer;
        }
        .selector-row select option {
          background: var(--bg-surface);
          color: var(--text-primary);
        }

        /* ── Sync Badge ── */
        .sync-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 8px;
          border: 1px solid var(--border);
          padding: 8px 12px;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          background: var(--bg-surface);
          min-height: 40px;
        }
        .sync-time { opacity: .5; }
        .sync-idle { color: var(--text-dim); }
        .sync-syncing { color: var(--blue); border-color: rgba(56,189,248,0.3); background: var(--blue-dim); }
        .sync-synced { color: var(--green); border-color: rgba(16,185,129,0.3); background: var(--green-dim); }
        .sync-error { color: var(--red); border-color: rgba(239,68,68,0.3); background: var(--red-dim); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Grid layouts ── */
        .grid-3 { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; margin-bottom: 20px; }
        .grid-main { display: grid; grid-template-columns: minmax(0,1.7fr) minmax(420px,460px); gap: 20px; margin-bottom: 20px; align-items: stretch; }
        .grid-2 { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; margin-bottom: 20px; }

        /* ── Card ── */
        .card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: var(--shadow-card);
        }

        /* ── KPI Card ── */
        .kpi-card {
          padding: 22px;
          min-height: 186px;
          position: relative;
          overflow: hidden;
        }
        .kpi-card::before {
          content: "";
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dim) 50%, transparent 100%);
        }
        .kpi-card.primary::before { background: var(--gold); }
        .kpi-card.soft::before { background: var(--green); }
        .kpi-card.neutral::before { background: var(--gold-dim); }
        .kpi-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
        .icon-box {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-elevated);
          color: var(--gold);
          border-radius: 10px;
          border: 1px solid var(--border);
        }
        .kpi-title { font-size: 12px; font-weight: 700; color: var(--text-secondary); }
        .kpi-helper { font-size: 11px; color: var(--text-dim); margin-top: 4px; font-family: 'DM Mono', monospace; }
        .kpi-value {
          font-family: 'DM Mono', monospace;
          font-size: 42px; line-height: .95;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-primary);
        }
        .kpi-card.soft .kpi-value { color: var(--green); }
        .kpi-card.neutral .kpi-value { color: var(--gold); }
        .kpi-delta {
          margin-top: 14px;
          font-family: 'DM Mono', monospace;
          font-size: 12px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .kpi-delta.green { color: var(--green); }
        .kpi-delta.red { color: var(--red); }
        .kpi-delta.gray { color: var(--text-dim); }
        .kpi-delta.muted { color: var(--text-dim); }

        /* ── Section Card ── */
        .section-card { padding: 22px; min-width: 0; }
        .section-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 16px; }
        .section-title-row { display: flex; align-items: center; gap: 8px; color: var(--gold); }
        .section-title-row h3 { margin: 0; font-size: 15px; font-weight: 800; color: var(--text-primary); }
        .section-header p { margin: 5px 0 0; font-size: 12px; color: var(--text-dim); font-family: 'DM Mono', monospace; }

        .chip {
          display: inline-flex; align-items: center; gap: 7px;
          border-radius: 8px; border: 1px solid var(--border);
          background: var(--bg-elevated);
          padding: 6px 10px; font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 700; color: var(--gold);
        }

        /* ── Trend Layout ── */
        .trend-layout { display: grid; grid-template-columns: minmax(0,1fr) 230px; gap: 16px; min-width: 0; }
        .tab-btn {
          border: 1px solid var(--border); border-radius: 8px;
          padding: 8px 14px; font-family: 'DM Mono', monospace;
          font-size: 12px; font-weight: 700; cursor: pointer;
          background: var(--bg-elevated); color: var(--text-dim);
          transition: .16s ease; white-space: nowrap; flex: 0 0 auto;
        }
        .tab-btn:hover { background: var(--bg-hover); color: var(--text-secondary); border-color: var(--border-bright); }
        .tab-btn.active {
          background: var(--gold);
          color: #FFFFFF;
          border-color: var(--gold);
        }

        .right-stack { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .stat-soft {
          border-radius: 14px; padding: 14px;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          min-width: 0;
          position: relative;
          overflow: hidden;
        }
        .stat-soft::before {
          content: "";
          position: absolute;
          left: 0; top: 0;
          width: 3px; height: 100%;
          border-radius: 14px 0 0 14px;
          background: var(--border);
        }
        .stat-soft.accent-amber::before { background: #FBBF24; }
        .stat-soft.accent-blue::before { background: #38BDF8; }
        .stat-soft.accent-slate::before { background: #8FA3BE; }
        .stat-soft.accent-green::before { background: #10B981; }
        .stat-soft.green { border-color: rgba(16,185,129,0.2); }
        .stat-soft.gray { border-color: var(--border); }
        .stat-label { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; color: var(--text-secondary); }
        .stat-value {
          margin-top: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 24px; font-weight: 800; color: var(--text-primary);
          letter-spacing: -0.02em; overflow-wrap: anywhere;
        }
        .stat-note { margin-top: 5px; font-size: 11px; color: var(--text-dim); font-family: 'DM Mono', monospace; }

        /* ── Executive Summary ── */
        .exec-summary { display: grid; grid-template-columns: 1fr; gap: 12px; min-width: 0; }
        .exec-hero {
          border: 1px solid var(--border); border-radius: 16px;
          padding: 18px; background: var(--bg-elevated);
          min-width: 0;
        }
        .exec-hero-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .exec-hero-value {
          margin-top: 10px;
          font-family: 'DM Mono', monospace;
          font-size: 36px; line-height: .95; font-weight: 800;
          color: var(--gold-bright); letter-spacing: -0.03em; overflow-wrap: anywhere;
        }
        .exec-pill {
          border-radius: 8px; padding: 5px 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 700;
          border: 1px solid var(--border);
          background: var(--bg-surface); color: var(--text-dim);
        }
        .exec-pill.good { background: var(--green-dim); border-color: rgba(16,185,129,0.3); color: var(--green); }
        .exec-pill.warn { background: rgba(251,191,36,0.12); border-color: rgba(251,191,36,0.3); color: #FBBF24; }
        .exec-pill.neutral { background: var(--bg-surface); border-color: var(--border); color: var(--text-dim); }
        .exec-hero-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; margin-top: 14px; margin-bottom: 10px; }
        .exec-mini-stat {
          border: 1px solid var(--border); background: var(--bg-surface);
          border-radius: 12px; padding: 10px 12px; min-width: 0;
        }
        .exec-mini-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700; color: var(--text-dim);
          letter-spacing: .1em; text-transform: uppercase;
        }
        .exec-mini-value {
          margin-top: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 16px; font-weight: 800; color: var(--text-primary);
          letter-spacing: -0.01em; overflow-wrap: anywhere;
        }
        .exec-side { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; min-width: 0; }
        .summary-box {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 16px 14px; min-width: 0;
        }
        .summary-box.light { background: var(--bg-surface); }
        .summary-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700; color: var(--text-dim);
          letter-spacing: .12em; text-transform: uppercase;
        }
        .summary-inline { display: flex; align-items: end; gap: 8px; margin-top: 12px; }
        .summary-value {
          margin-top: 12px;
          font-family: 'DM Mono', monospace;
          font-size: 32px; line-height: .98; font-weight: 800;
          color: var(--text-primary); letter-spacing: -0.04em;
          overflow-wrap: anywhere;
        }
        .summary-value.soft { color: var(--text-secondary); font-size: 22px; font-weight: 700; line-height: 1.02; word-break: break-word; }
        .summary-note { margin-top: 6px; font-size: 11px; color: var(--text-dim); line-height: 1.5; }

        /* ── Input ── */
        .input {
          height: 38px; border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-deep);
          padding: 0 12px;
          font-family: 'DM Mono', monospace;
          font-size: 13px; font-weight: 600;
          color: var(--text-primary);
          outline: none; width: 100%;
          transition: .16s ease; min-width: 0;
        }
        .input:focus {
          border-color: var(--gold-dim);
          box-shadow: 0 0 0 2px var(--gold-glow);
        }
        .input::placeholder { color: var(--text-dim); }

        /* ── Pie Layout ── */
        .pie-layout { display: grid; grid-template-columns: 240px minmax(0,1fr); align-items: center; gap: 20px; }
        .pie-wrap { position: relative; width: 230px; height: 230px; margin: 0 auto; }
        .pie-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
        .pie-center .big {
          font-family: 'DM Mono', monospace;
          font-size: 20px; font-weight: 900; color: var(--gold);
          letter-spacing: -0.03em;
        }
        .pie-center .small { margin-top: 4px; font-size: 10px; color: var(--text-dim); font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }

        .rank-list { display: flex; flex-direction: column; gap: 6px; }
        .rank-item {
          display: flex; justify-content: space-between; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 12px;
          background: var(--bg-elevated); border: 1px solid var(--border);
        }
        .rank-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .rank-num {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--bg-deep);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace;
          color: var(--gold-dim); font-size: 11px; font-weight: 800;
          border: 1px solid var(--border); flex: 0 0 auto;
        }
        .dot { width: 12px; height: 12px; border-radius: 4px; display: inline-block; flex: 0 0 auto; }
        .rank-name { font-weight: 700; font-size: 13px; }
        .rank-right { text-align: right; }
        .rank-right .v1 { font-family: 'DM Mono', monospace; font-weight: 800; color: var(--text-primary); font-size: 14px; }
        .rank-right .v2 { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-dim); }

        /* ── Cost List ── */
        .cost-list { display: flex; flex-direction: column; gap: 10px; }
        .cost-item { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 14px; padding: 14px; }
        .cost-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 10px; }
        .cost-title { font-weight: 800; color: var(--text-primary); font-size: 13px; }
        .cost-sub { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-dim); margin-top: 3px; }
        .inline-actions { display: flex; align-items: center; gap: 6px; flex: 0 0 auto; }
        .icon-btn {
          border: 1px solid var(--border);
          background: var(--bg-surface);
          color: var(--text-dim);
          border-radius: 8px; padding: 7px; cursor: pointer;
          transition: .16s ease; flex: 0 0 auto;
        }
        .icon-btn:hover { background: var(--red-dim); color: var(--red); border-color: rgba(239,68,68,0.3); }
        .progress { height: 8px; background: var(--bg-deep); border-radius: 999px; overflow: hidden; }
        .progress > div { height: 100%; background: var(--gold-dim); border-radius: 999px; transition: width .3s ease; }

        /* ── Big Table Section ── */
        .big-table-card { overflow: hidden; }
        .big-header {
          display: grid; grid-template-columns: minmax(0,1fr) auto;
          gap: 20px; align-items: start;
          padding: 22px; border-bottom: 1px solid var(--border);
        }
        .big-header-title { display: flex; align-items: center; gap: 10px; }
        .big-header-title h3 {
          margin: 0;
          font-size: 28px; font-weight: 900; letter-spacing: -0.03em;
        }
        .big-header-note { margin-top: 5px; font-size: 12px; color: var(--text-dim); font-family: 'DM Mono', monospace; }
        .big-header-right { text-align: right; min-width: 300px; }
        .big-revenue {
          font-family: 'DM Mono', monospace;
          font-size: 36px; font-weight: 800;
          color: var(--green); margin-top: 6px;
          letter-spacing: -0.03em;
        }

        .work-grid { display: grid; grid-template-columns: 310px minmax(0,1fr); gap: 20px; padding: 22px; }

        /* ── Sidebar ── */
        .sidebar-box {
          border: 1px solid var(--border);
          border-radius: 16px; background: var(--bg-elevated);
          padding: 14px;
        }
        .sidebar-box.white { background: var(--bg-surface); }
        .sidebar-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; }
        .sidebar-title { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 800; color: var(--text-secondary); }
        .small-chip {
          border: 1px solid var(--border);
          background: var(--bg-deep);
          color: var(--gold);
          border-radius: 8px; padding: 3px 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700;
        }
        .ad-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
        .mini-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 10px; min-width: 0;
        }
        .mini-label { font-size: 10px; font-weight: 700; color: var(--text-dim); margin-bottom: 5px; text-transform: uppercase; letter-spacing: .06em; }
        .mini-row { display: flex; align-items: center; gap: 5px; }

        .btn-add {
          border: 1px solid var(--border);
          background: var(--bg-surface);
          color: var(--gold);
          border-radius: 8px; padding: 8px 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 5px;
          cursor: pointer; transition: .16s ease; flex: 0 0 auto;
        }
        .btn-add:hover { background: var(--gold-glow); border-color: var(--gold-dim); }

        .orders-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px; }
        .orders-table-head, .order-row {
          display: grid; grid-template-columns: 1.15fr 1fr 1fr auto;
          gap: 10px; align-items: center;
        }
        .orders-table-head {
          border-top: 1px solid var(--border); padding-top: 14px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; text-transform: uppercase;
          letter-spacing: .1em; color: var(--text-dim); font-weight: 700;
        }
        .order-list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .order-row .channel-name { font-size: 12px; font-weight: 800; color: var(--text-secondary); min-width: 0; }
        .fixed-badge {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--bg-deep);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: var(--text-dim); font-weight: 700;
        }

        .orders-stats {
          display: grid; grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px; border-top: 1px solid var(--border);
          padding-top: 14px; margin-top: 14px;
        }
        .stat-box {
          border: 1px solid var(--border);
          background: var(--bg-deep);
          border-radius: 14px; padding: 12px 14px; min-width: 0;
        }
        .stat-box .s1 {
          font-family: 'DM Mono', monospace;
          font-size: 9px; font-weight: 700; color: var(--text-dim);
          text-transform: uppercase; letter-spacing: .1em;
        }
        .stat-box .s2 {
          margin-top: 5px;
          font-family: 'DM Mono', monospace;
          font-size: 24px; font-weight: 800; color: var(--gold);
          letter-spacing: -0.02em; overflow-wrap: anywhere;
        }

        /* ── Toolbar ── */
        .toolbar { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }
        .toolbar-left {
          display: flex; flex-wrap: nowrap; align-items: center; gap: 6px;
          overflow-x: auto; overflow-y: hidden;
          scrollbar-width: none; min-width: 0;
        }
        .toolbar-left::-webkit-scrollbar { display: none; }
        .field-box {
          display: flex; align-items: center; gap: 6px;
          border: 1px solid var(--border);
          background: var(--bg-elevated);
          border-radius: 10px; padding: 8px 10px; flex: 0 0 auto;
        }
        .field-box span {
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700; color: var(--text-dim);
        }
        .field-box select, .field-box input { border: none; outline: none; background: transparent; color: var(--text-primary); }
        .field-box select {
          font-family: 'DM Mono', monospace;
          font-weight: 700; color: var(--gold); cursor: pointer;
        }
        .field-box select option { background: var(--bg-surface); color: var(--text-primary); }
        .field-box input { min-width: 90px; font-family: 'DM Mono', monospace; font-size: 12px; }
        .field-box input::placeholder { color: var(--text-dim); }

        /* ── Day-range bar ── */
        .range-bar {
          display: flex; flex-wrap: wrap; gap: 8px;
          align-items: center; margin-bottom: 12px;
        }
        .range-bar .tab-btn { padding: 6px 12px; font-size: 11px; }
        .range-compare {
          margin-left: auto;
          display: flex; flex-wrap: wrap; gap: 6px; align-items: center;
        }
        .range-chip {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid var(--border); border-radius: 8px;
          background: var(--bg-elevated);
          padding: 6px 10px;
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 700; color: var(--text-secondary);
        }
        .range-chip strong { color: var(--text-primary); font-weight: 800; }
        .range-chip .up { color: var(--green); }
        .range-chip .down { color: var(--red); }
        /* ── Weekday badge ── */
        .weekday-badge {
          display: inline-block;
          margin-left: 6px;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-dim);
        }
        .weekday-badge.weekend { color: #FBBF24; }
        [data-theme="light"] .weekday-badge.weekend { color: #8A6A2E; }

        /* ── Table ── */
        .table-wrap {
          overflow: hidden; border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--bg-deep);
        }
        .table-scroll { max-height: 820px; overflow: auto; }
        .table-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: var(--bg-deep); }
        .table-scroll::-webkit-scrollbar-thumb { background: var(--border-bright); border-radius: 999px; }

        table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 13px; }
        thead th {
          position: sticky; top: 0; z-index: 2;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border);
          padding: 12px 14px; text-align: center;
          font-family: 'DM Mono', monospace;
          font-weight: 700; font-size: 11px;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: .06em;
          white-space: nowrap;
        }
        tbody td {
          border-bottom: 1px solid var(--table-border);
          padding: 8px 10px;
        }
        tbody tr:hover { background: var(--bg-hover); }
        .sticky-left {
          position: sticky; left: 0; z-index: 1;
          background: var(--bg-deep);
          text-align: left;
          padding-left: 14px;
          font-family: 'DM Mono', monospace;
          font-weight: 800; color: var(--text-dim);
          white-space: nowrap;
        }
        tbody tr:hover .sticky-left { background: var(--bg-hover); }
        tbody tr.row-spike .sticky-left { background: rgba(251,191,36,0.04); }
        tbody tr.row-low .sticky-left { background: rgba(239,68,68,0.03); }
        tbody tr.row-spike:hover .sticky-left { background: rgba(251,191,36,0.08); }
        tbody tr.row-low:hover .sticky-left { background: rgba(239,68,68,0.06); }
        [data-theme="light"] tbody tr.row-spike .sticky-left { background: rgba(251,191,36,0.05); }
        [data-theme="light"] tbody tr.row-low .sticky-left { background: rgba(239,68,68,0.04); }
        [data-theme="light"] tbody tr.row-spike:hover .sticky-left { background: rgba(251,191,36,0.1); }
        [data-theme="light"] tbody tr.row-low:hover .sticky-left { background: rgba(239,68,68,0.08); }
        .cell-input {
          width: 100%; height: 36px; border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-surface);
          padding: 0 8px; text-align: right;
          font-family: 'DM Mono', monospace;
          font-weight: 700; font-size: 13px;
          color: var(--text-primary);
          outline: none; transition: .16s ease;
        }
        .cell-input:focus {
          border-color: var(--gold-dim);
          box-shadow: 0 0 0 2px var(--gold-glow);
        }
        .subtotal {
          text-align: right;
          font-family: 'DM Mono', monospace;
          font-weight: 800; color: var(--text-primary);
        }
        .subtotal.low { color: var(--text-dim); }
        .subtotal.mid { color: var(--gold-dim); }
        .subtotal.high { color: var(--gold); }

        tfoot td {
          position: sticky; bottom: 0; z-index: 2;
          background: var(--bg-elevated);
          border-top: 2px solid var(--gold-dim);
          padding: 14px;
          font-weight: 800;
        }
        .tfoot-row-upgraded td { background: var(--bg-elevated); }
        .tfoot-left {
          position: sticky; left: 0; z-index: 3;
          color: var(--text-secondary); white-space: nowrap;
        }
        .tfoot-left.upgraded { padding-top: 12px; padding-bottom: 12px; }
        .tfoot-left-wrap { display: flex; flex-direction: column; gap: 2px; }
        .tfoot-title { font-size: 13px; font-weight: 900; color: var(--gold); }
        .tfoot-sub {
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: var(--text-dim);
          font-weight: 600; letter-spacing: .06em;
        }
        .tfoot-right { text-align: right; }
        .tfoot-right.upgraded { vertical-align: middle; }
        .tfoot-number {
          font-family: 'DM Mono', monospace;
          font-size: 14px; font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--text-primary);
        }
        .tfoot-number.muted { color: var(--text-secondary); }
        .tfoot-right.upgraded.grand-total {
          min-width: 160px;
          background: var(--gold-glow);
          border-radius: 10px;
        }
        .tfoot-total-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; text-transform: uppercase;
          letter-spacing: .1em; color: var(--gold-dim);
          font-weight: 700; margin-bottom: 3px;
        }
        .tfoot-total-value {
          font-family: 'DM Mono', monospace;
          font-size: 18px; font-weight: 800;
          color: var(--gold); letter-spacing: -0.02em;
        }

        .footer-note {
          margin-top: 12px;
          display: flex; align-items: center; gap: 7px;
          color: var(--text-dim);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
        }

        /* ── Tooltip (always dark, both themes) ── */
        .tooltip-card {
          min-width: 260px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          background: #1A2840;
          padding: 18px 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.1);
          color: #E5E7EB;
          font-size: 14px;
        }
        .tooltip-month {
          font-family: 'DM Mono', monospace;
          font-size: 20px;
          font-weight: 900;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .tooltip-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tooltip-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tooltip-label-dot {
          width: 8px;
          height: 8px;
          border-radius: 3px;
          flex: 0 0 auto;
        }
        .tooltip-label {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: #9CA3AF;
        }
        .tooltip-label.sec { color: #6B7280; }
        .tooltip-val {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .tooltip-val.sec { color: #9CA3AF; font-weight: 600; }
        .tooltip-yoy-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 4px 0;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 13px;
          font-weight: 600;
          color: #9CA3AF;
        }
        .yoy-pos {
          font-family: 'DM Mono', monospace;
          font-size: 15px;
          font-weight: 800;
          color: #34D399;
          background: rgba(52,211,153,0.12);
          padding: 3px 10px;
          border-radius: 8px;
        }
        .yoy-neg {
          font-family: 'DM Mono', monospace;
          font-size: 15px;
          font-weight: 800;
          color: #F87171;
          background: rgba(248,113,113,0.12);
          padding: 3px 10px;
          border-radius: 8px;
        }
        .t-gold { color: var(--gold); font-weight: 700; }
        .t-dim { color: var(--text-dim); font-weight: 700; }
        .t-green { color: var(--green); }
        .t-red { color: var(--red); }

        /* ── Anomaly flags ── */
        .anomaly-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .04em;
          padding: 2px 7px;
          border-radius: 6px;
          margin-left: 6px;
          vertical-align: middle;
        }
        .anomaly-badge.spike {
          background: rgba(251,191,36,0.15);
          color: #FBBF24;
          border: 1px solid rgba(251,191,36,0.25);
        }
        .anomaly-badge.low {
          background: rgba(239,68,68,0.12);
          color: #EF4444;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .anomaly-badge.zero {
          background: rgba(107,127,158,0.12);
          color: #6B7F9E;
          border: 1px solid rgba(107,127,158,0.2);
        }
        [data-theme="light"] .anomaly-badge.spike { background: rgba(138,106,46,0.08); color: #8A6A2E; border-color: rgba(138,106,46,0.2); }
        [data-theme="light"] .anomaly-badge.low { background: rgba(166,50,40,0.07); color: #A63228; border-color: rgba(166,50,40,0.18); }
        [data-theme="light"] .anomaly-badge.zero { background: rgba(28,28,30,0.05); color: #77777D; border-color: rgba(28,28,30,0.1); }

        tr.row-spike { background: rgba(251,191,36,0.04); }
        tr.row-low { background: rgba(239,68,68,0.03); }
        tr.row-zero { }
        [data-theme="light"] tr.row-spike { background: rgba(251,191,36,0.05); }
        [data-theme="light"] tr.row-low { background: rgba(239,68,68,0.04); }

        /* ── Responsive ── */
        @media (max-width: 1280px) {
          .grid-3, .grid-main, .grid-2, .work-grid, .trend-layout, .pie-layout, .exec-summary, .topbar, .big-header { grid-template-columns: 1fr; }
          .exec-side { grid-template-columns: 1fr 1fr; }
          .topbar-right { justify-content: flex-start; }
          .big-header-right { text-align: left; min-width: 0; }
        }
        @media (max-width: 980px) { .exec-side { grid-template-columns: 1fr; } }
        @media (max-width: 900px) {
          .container { padding: 14px; }
          .page-title { font-size: 32px; }
          .kpi-value { font-size: 32px; }
          .summary-value { font-size: 24px; }
          .big-header-title h3 { font-size: 22px; }
          .big-revenue { font-size: 28px; }
          .ad-grid { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr; }
        }

        /* ── Theme Toggle ── */
        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border);
          background: var(--bg-surface);
          border-radius: 12px;
          padding: 6px 8px;
          cursor: pointer;
          transition: .2s ease;
          min-height: 40px;
          color: var(--gold);
        }
        .theme-toggle:hover {
          border-color: var(--gold-dim);
          background: var(--bg-hover);
        }
        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: 999px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          position: relative;
          transition: .25s ease;
        }
        [data-theme="light"] .toggle-track {
          background: var(--gold);
          border-color: var(--gold);
        }
        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: var(--gold);
          transition: .25s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        [data-theme="light"] .toggle-thumb {
          left: 22px;
          background: #FFFFFF;
        }
        .toggle-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-dim);
          letter-spacing: .08em;
          text-transform: uppercase;
          user-select: none;
        }

        /* ── Light mode overrides ──
           大部分顏色由 CSS 變數自動切換，這裡只留變數蓋不到的例外 */
        [data-theme="light"] .exec-pill.warn { background: rgba(138,106,46,0.1); border-color: rgba(138,106,46,0.25); color: #8A6A2E; }
        [data-theme="light"] .exec-pill.good { border-color: rgba(45,106,79,0.25); }
        [data-theme="light"] .stat-soft.accent-amber::before { background: #8A6A2E; }
        [data-theme="light"] .stat-soft.accent-blue::before { background: #4A7FA5; }
        [data-theme="light"] .stat-soft.accent-slate::before { background: #77777D; }
        [data-theme="light"] .stat-soft.green { border-color: rgba(45,106,79,0.2); }
        [data-theme="light"] .sync-synced { border-color: rgba(45,106,79,0.25); }
        [data-theme="light"] .sync-syncing { border-color: rgba(74,127,165,0.25); }
        [data-theme="light"] .sidebar-box { background: var(--bg-surface); }
        [data-theme="light"] .sticky-left { background: var(--bg-surface); }
        [data-theme="light"] .cell-input { background: var(--bg-surface); }
        [data-theme="light"] .input { background: var(--bg-surface); }
        [data-theme="light"] .table-wrap { background: var(--bg-surface); }
        [data-theme="light"] .stat-box { background: var(--bg-elevated); }
        [data-theme="light"] .fixed-badge { background: var(--bg-elevated); }
        [data-theme="light"] .rank-num { background: var(--bg-elevated); }
        [data-theme="light"] .small-chip { background: var(--bg-elevated); }
        [data-theme="light"] .progress { background: var(--bg-elevated); }

        /* ── Recharts text ── */
        [data-theme="dark"] .recharts-text { fill: #6B7F9E !important; font-family: 'DM Mono', monospace !important; }
        [data-theme="light"] .recharts-text { fill: #77777D !important; font-family: 'DM Mono', monospace !important; }
      `}</style>

      <div className="app" data-theme={theme}>
        <main className="container">
          {/* ── TOPBAR ── */}
          <div className="topbar">
            <div>
              <div className="eyebrow">
                <Sparkles size={13} />
                REVENUE COMMAND CENTER
              </div>
              <h1 className="page-title">總部營收戰情室</h1>
              <div className="page-subtitle">
                高階營運總覽 · 異常洞察 · 每日營收管理
              </div>
            </div>
            <div className="topbar-right">
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === "dark" ? "切換淺色模式" : "切換深色模式"}
                aria-label={theme === "dark" ? "切換淺色模式" : "切換深色模式"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {theme === "dark" ? (
                    <>
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </>
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </>
                  )}
                </svg>
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
                <span className="toggle-label">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              </button>
              <SyncBadge syncState={syncState} lastSyncedAt={lastSyncedAt} />
              <div className="selector-box">
                <div className="selector-label">Fiscal Year</div>
                <div className="selector-row">
                  <select
                    value={activeYear}
                    onChange={(e) => setActiveYear(e.target.value)}
                    aria-label="選擇會計年度"
                  >
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} color="var(--text-dim)" />
                </div>
              </div>
              <div className="selector-box">
                <div className="selector-label">Current Month</div>
                <div className="selector-row">
                  <select
                    value={activeMonth}
                    onChange={(e) => loadMonth(e.target.value)}
                    aria-label="選擇月份"
                  >
                    {MONTH_TABS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} color="var(--text-dim)" />
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI CARDS ── */}
          <section className="grid-3">
            <KPICard
              title="本年度累計營收 (YTD)"
              helper="FISCAL YEAR TOTAL"
              value={money(ytd)}
              delta={
                ytd > 0
                  ? `${ytdYoY >= 0 ? "+" : ""}${ytdYoY.toFixed(1)}% vs 去年同期`
                  : "尚無累計資料"
              }
              tone={ytdYoY > 0 ? "green" : ytdYoY < 0 ? "red" : "gray"}
              icon={DollarSign}
              muted={ytd === 0}
              variant="primary"
            />
            <KPICard
              title={`${activeMonth} 當月營收`}
              helper="REALTIME"
              value={money(currentRevenue)}
              delta={
                currentRevenue > 0
                  ? `${yoy >= 0 ? "+" : ""}${yoy.toFixed(1)}% YoY`
                  : "本月尚未輸入"
              }
              tone={yoy > 0 ? "green" : yoy < 0 ? "red" : "gray"}
              icon={TrendingUp}
              muted={yoyMuted}
              variant="soft"
            />
            <KPICard
              title="年度目標達成率"
              helper="ANNUAL TARGET"
              value={`${annualRate.toFixed(1)}%`}
              delta={
                currentRevenue > 0
                  ? `本月 ${achieveRate.toFixed(1)}%`
                  : "待更新"
              }
              tone="gray"
              icon={Target}
              muted={targetMuted}
              variant="neutral"
            />
          </section>

          {/* ── TREND + SUMMARY ── */}
          <section className="grid-main">
            <div className="card section-card">
              <SectionHeader
                icon={TrendingUp}
                title="營收趨勢總覽"
                desc="YEARLY TREND · ACTUAL vs TARGET vs LAST YEAR"
                right={
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div className="field-box" style={{ padding: "6px 10px" }}>
                      <span>通路</span>
                      <select
                        value={trendChannel}
                        onChange={(e) => setTrendChannel(e.target.value)}
                        aria-label="選擇趨勢圖通路"
                      >
                        <option value="all">全部</option>
                        {yearChannels.map((k) => (
                          <option key={k} value={k}>
                            {labelOf(k)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} color="var(--text-dim)" />
                    </div>
                    <div className="chip">
                      <Eye size={13} />
                      {trendChannel === "all" ? "LIVE" : labelOf(trendChannel)}
                    </div>
                  </div>
                }
              />
              <div className="trend-layout">
                <div>
                  <div style={{ height: 380, marginTop: 4 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={trendChartData} barCategoryGap={28}>
                        <CartesianGrid
                          vertical={false}
                          stroke={tc.border}
                          strokeDasharray="3 6"
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tick={{
                            fill: tc.textDim,
                            fontSize: 11,
                            fontFamily: "'DM Mono', monospace",
                          }}
                        />
                        <YAxis
                          tickFormatter={(v) =>
                            Math.round(Number(v) / 10000) + "萬"
                          }
                          tickLine={false}
                          axisLine={false}
                          tick={{
                            fill: tc.textDim,
                            fontSize: 11,
                            fontFamily: "'DM Mono', monospace",
                          }}
                        />
                        <Tooltip
                          content={<TooltipCard />}
                          cursor={{ fill: tc.goldGlow }}
                        />
                        <Line
                          type="monotone"
                          dataKey="lastYear"
                          stroke={tc.textDim}
                          strokeWidth={1.5}
                          dot={{ r: 2, fill: tc.textDim }}
                          activeDot={{ r: 3.5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke={tc.goldDim}
                          strokeWidth={1.2}
                          dot={false}
                          strokeDasharray="4 4"
                        />
                        <Bar
                          dataKey="actual"
                          fill={
                            trendChannel === "all"
                              ? tc.gold
                              : colorOf(trendChannel, 0, theme)
                          }
                          radius={[6, 6, 0, 0]}
                          barSize={26}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="right-stack">
                  <div className="stat-soft accent-amber">
                    <div className="stat-label">
                      <Target size={14} />
                      本月風險
                    </div>
                    <div className="stat-value">
                      {currentRevenue === 0
                        ? "待輸入"
                        : yoy < -20
                        ? "⚠ 需注意"
                        : "✓ 正常"}
                    </div>
                    <div className="stat-note">
                      {currentRevenue === 0
                        ? "尚未形成比較"
                        : `YoY ${yoy.toFixed(1)}%`}
                    </div>
                  </div>
                  <div className="stat-soft accent-blue">
                    <div className="stat-label">
                      <Target size={14} />
                      目標進度
                    </div>
                    <div className="stat-value">{achieveRate.toFixed(1)}%</div>
                    <div className="stat-note">本月達成率</div>
                  </div>
                  <div className="stat-soft accent-slate">
                    <div className="stat-label">
                      <Target size={14} />
                      與目標差額
                    </div>
                    <div
                      className="stat-value"
                      style={gapToTarget >= 0 ? { color: "var(--green)" } : {}}
                    >
                      {money(gapToTarget)}
                    </div>
                    <div className="stat-note">
                      {currentRevenue >= currentTarget
                        ? "已超過目標"
                        : "距目標尚有差距"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card section-card">
              <SectionHeader
                icon={Target}
                title="目標與摘要"
                desc="ACHIEVEMENT · GROWTH · PROJECTION"
              />
              <div className="exec-summary">
                <div className="exec-hero">
                  <div className="exec-hero-top">
                    <div>
                      <div className="summary-label">目前達成</div>
                      <div className="exec-hero-value">
                        {annualRate.toFixed(1)}%
                      </div>
                    </div>
                    <div
                      className={`exec-pill ${
                        ytd === 0
                          ? "neutral"
                          : paceRate >= 100
                          ? "good"
                          : paceRate >= 90
                          ? "warn"
                          : "neutral"
                      }`}
                    >
                      {ytd === 0
                        ? "NO DATA"
                        : paceRate >= 100
                        ? "AHEAD"
                        : paceRate >= 90
                        ? "ON TRACK"
                        : "BEHIND"}
                    </div>
                  </div>
                  <div className="exec-hero-grid">
                    <div className="exec-mini-stat">
                      <div className="exec-mini-label">年度目標</div>
                      <div className="exec-mini-value">
                        {money(annualTarget)}
                      </div>
                    </div>
                    <div className="exec-mini-stat">
                      <div className="exec-mini-label">年度累計</div>
                      <div className="exec-mini-value">{money(ytd)}</div>
                    </div>
                  </div>
                  <div className="summary-note">
                    {ytd > 0
                      ? `同期目標達成 ${paceRate.toFixed(
                          1
                        )}%（僅比較已有實績的月份）· 上方為對照全年總目標的進度`
                      : "全年進度對照年度總目標"}
                  </div>
                </div>
                <div className="exec-side">
                  <div className="summary-box">
                    <div className="summary-label">目標成長</div>
                    <div className="summary-inline">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={targetGrowthRate}
                        onChange={(e) => changeGrowthRate(e.target.value)}
                        className="input"
                        aria-label="目標成長率（百分比）"
                        style={{
                          width: 100,
                          textAlign: "right",
                          fontSize: 24,
                          fontWeight: 800,
                        }}
                      />
                      <span
                        style={{
                          paddingBottom: 4,
                          color: "var(--gold-dim)",
                          fontWeight: 800,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        %
                      </span>
                    </div>
                    <div className="summary-note">
                      目標 = 去年同期 × (1 + rate)
                    </div>
                  </div>
                  <div className="summary-box light">
                    <div
                      className="summary-label"
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <TrendingUp size={12} />
                      預估年度營收
                    </div>
                    <div className="summary-value soft">
                      {money(projectedAnnual)}
                    </div>
                    <div className="summary-note">
                      {monthsWithRevenue >= 12
                        ? "全年資料已齊，等於實際累計"
                        : `依 ${monthsWithRevenue} 個月平均推算 · 未含季節性`}
                    </div>
                    {annualTarget > 0 && (
                      <div className="summary-note" style={{ marginTop: 2 }}>
                        {projectedAnnual >= annualTarget
                          ? "✓ 預估可達標"
                          : "⚠ 預估未達年度目標"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── PIE + COST ── */}
          <section className="grid-2">
            <div className="card section-card">
              <SectionHeader
                icon={CalendarDays}
                title="營收結構"
                desc="CHANNEL MIX & SHARE"
              />
              <div className="pie-layout">
                <div className="pie-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={88}
                        paddingAngle={2}
                        stroke={tc.bgDeep}
                        strokeWidth={3}
                      >
                        {donutData.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pie-center">
                    <div className="big">{money(currentRevenue)}</div>
                    <div className="small">TOTAL</div>
                  </div>
                </div>
                <div className="rank-list">
                  {donutData.map((item, i) => (
                    <div key={item.key} className="rank-item">
                      <div className="rank-left">
                        <div className="rank-num">#{i + 1}</div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                          }}
                        >
                          <span
                            className="dot"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="rank-name">{item.name}</span>
                        </div>
                      </div>
                      <div className="rank-right">
                        <div className="v1">{num(item.value)}</div>
                        <div className="v2">
                          {currentRevenue
                            ? ((item.value / currentRevenue) * 100).toFixed(1)
                            : "0.0"}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card section-card">
              <SectionHeader
                icon={Zap}
                title="行銷成本"
                desc="AD SPEND BY CHANNEL"
                right={
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "var(--gold)",
                    }}
                  >
                    {money(
                      adSpendEntries.reduce((sum, item) => sum + n(item[1]), 0)
                    )}
                  </div>
                }
              />
              <div className="cost-list">
                {(() => {
                  const maxSpend = Math.max(
                    ...adSpendEntries.map(([, v]) => n(v)),
                    1
                  );
                  let colorIdx = 0;
                  return adSpendEntries.map(([key, value]) => {
                    const numeric = n(value);
                    const barColor = colorOf(key, colorIdx++, theme);
                    return (
                      <div key={key} className="cost-item">
                        <div className="cost-head">
                          <div>
                            <div className="cost-title">{labelOf(key)}</div>
                            <div className="cost-sub">
                              佔營收{" "}
                              {currentRevenue
                                ? ((numeric / currentRevenue) * 100).toFixed(1)
                                : "0.0"}
                              %
                            </div>
                          </div>
                          <div className="inline-actions">
                            <input
                              type="text"
                              inputMode="numeric"
                              className="input"
                              style={{ width: 110, textAlign: "right" }}
                              value={value}
                              aria-label={`${labelOf(key)} 廣告費用`}
                              onChange={(e) =>
                                setAdSpendValue(key, e.target.value)
                              }
                            />
                            <button
                              type="button"
                              className="icon-btn"
                              title={`刪除 ${labelOf(key)}`}
                              aria-label={`刪除廣告渠道 ${labelOf(key)}`}
                              onClick={() => removeAdChannel(key)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <div className="progress">
                          <div
                            style={{
                              width:
                                Math.max(
                                  (numeric / maxSpend) * 100,
                                  numeric > 0 ? 4 : 0
                                ) + "%",
                              background: barColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </section>

          {/* ── BIG TABLE ── */}
          <section className="card big-table-card">
            <div className="big-header">
              <div>
                <div className="big-header-title">
                  <CalendarDays size={18} color="var(--gold-dim)" />
                  <h3>每日營收與支出管理</h3>
                </div>
                <div className="big-header-note">
                  DAILY REVENUE WORKSTATION · Tab↹ 右移 · Enter↵ 下移 · Ctrl+Z
                  復原
                </div>
              </div>
              <div className="big-header-right">
                <div
                  style={{
                    marginBottom: 6,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <SyncBadge
                    syncState={syncState}
                    lastSyncedAt={lastSyncedAt}
                  />
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: "var(--text-dim)",
                    fontWeight: 700,
                  }}
                >
                  {activeYear}／{activeMonth}
                </div>
                <div className="big-revenue">{money(currentRevenue)}</div>
              </div>
            </div>

            <div className="work-grid">
              <aside
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {/* Ad Spend Sidebar */}
                <div className="sidebar-box">
                  <div className="sidebar-head">
                    <div className="sidebar-title">
                      <Zap size={14} color="var(--gold-dim)" />
                      廣告投放
                    </div>
                    <span className="small-chip">
                      {money(
                        adSpendEntries.reduce(
                          (sum, item) => sum + n(item[1]),
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="ad-grid">
                    {adSpendEntries.map(([key, value]) => (
                      <div key={key} className="mini-card">
                        <div className="mini-label">{labelOf(key)}</div>
                        <div className="mini-row">
                          <input
                            type="text"
                            inputMode="numeric"
                            className="input"
                            style={{ flex: 1, textAlign: "right" }}
                            value={value}
                            aria-label={`${labelOf(key)} 廣告費用`}
                            onChange={(e) =>
                              setAdSpendValue(key, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="icon-btn"
                            title={`刪除 ${labelOf(key)}`}
                            aria-label={`刪除廣告渠道 ${labelOf(key)}`}
                            onClick={() => removeAdChannel(key)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                    <input
                      value={newAdChannel}
                      onChange={(e) => setNewAdChannel(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addAdChannel()}
                      placeholder="新增渠道"
                      aria-label="新增廣告渠道名稱"
                      className="input"
                    />
                    <button
                      type="button"
                      className="btn-add"
                      onClick={addAdChannel}
                    >
                      <Plus size={13} />
                      新增
                    </button>
                  </div>
                </div>

                {/* Orders Sidebar */}
                <div className="sidebar-box white">
                  <div className="orders-head">
                    <div className="sidebar-title">
                      <Wallet size={14} color="var(--gold-dim)" />
                      訂單管理
                    </div>
                    <span className="chip">
                      {hasEstimatedOrders ? "≈" : ""}
                      {totalOrdersAllChannels} 單
                    </span>
                  </div>
                  <div className="orders-table-head">
                    <div>Channel</div>
                    <div style={{ textAlign: "center" }}>Orders</div>
                    <div style={{ textAlign: "center" }}>AOV</div>
                    <div />
                  </div>
                  <div className="order-list">
                    {orderInfos.map((o) => {
                      const aov =
                        o.count > 0 ? Math.round(o.amount / o.count) : 0;
                      const isFixed = FIXED_CHANNELS.some(
                        (c) => c.key === o.key
                      );
                      return (
                        <div key={o.key} className="order-row">
                          <div className="channel-name">{labelOf(o.key)}</div>
                          <div>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={o.inputValue}
                              placeholder={
                                o.estimate > 0 ? `≈${o.estimate}` : "0"
                              }
                              aria-label={`${labelOf(o.key)} 訂單數`}
                              onChange={(e) =>
                                setOrderOverride(o.key, e.target.value)
                              }
                              className="input"
                              style={{ textAlign: "center" }}
                            />
                          </div>
                          <div>
                            <div
                              style={{
                                border: "1px solid var(--border)",
                                background: "var(--bg-deep)",
                                borderRadius: 8,
                                padding: "8px 10px",
                                textAlign: "center",
                                fontFamily: "'DM Mono', monospace",
                                fontWeight: 800,
                                color: "var(--text-secondary)",
                                fontSize: 13,
                              }}
                            >
                              {aov ? `$${num(aov)}` : "$0"}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {!isFixed ? (
                              <button
                                type="button"
                                className="icon-btn"
                                title={`刪除 ${labelOf(o.key)}`}
                                aria-label={`刪除通路 ${labelOf(o.key)}`}
                                onClick={() => removeRevenueChannel(o.key)}
                              >
                                <Trash2 size={13} />
                              </button>
                            ) : (
                              <div className="fixed-badge">FX</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="orders-stats">
                    <div className="stat-box">
                      <div className="s1">日均單量</div>
                      <div className="s2">{avgDailyOrdersAllChannels}</div>
                    </div>
                    <div className="stat-box">
                      <div className="s1">平均客單價</div>
                      <div className="s2">{avgOrderValueAllChannels}</div>
                    </div>
                  </div>
                  {hasEstimatedOrders && (
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 10,
                        color: "var(--text-dim)",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      ※ 未填寫的通路以「營收 ÷ 10,000」推估訂單數
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <input
                      value={newRevenueChannel}
                      onChange={(e) => setNewRevenueChannel(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && addRevenueChannel()
                      }
                      placeholder="新增渠道"
                      aria-label="新增營收通路名稱"
                      className="input"
                    />
                    <button
                      type="button"
                      className="btn-add"
                      onClick={addRevenueChannel}
                    >
                      <Plus size={13} />
                      新增
                    </button>
                  </div>
                </div>
              </aside>

              {/* Table Area */}
              <div style={{ minWidth: 0 }}>
                <div className="toolbar">
                  <div className="toolbar-left">
                    <div className="field-box">
                      <span>年份</span>
                      <select
                        value={activeYear}
                        onChange={(e) => setActiveYear(e.target.value)}
                        aria-label="選擇年份"
                      >
                        {YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} color="var(--text-dim)" />
                    </div>
                    {MONTH_TABS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`tab-btn ${
                          activeMonth === m ? "active" : ""
                        }`}
                        onClick={() => loadMonth(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="field-box" style={{ position: "relative" }}>
                    <Search size={14} color="var(--text-dim)" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setSearch("")}
                      placeholder="搜尋日期"
                      aria-label="搜尋日期（輸入日數）"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        aria-label="清除搜尋"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-dim)",
                          cursor: "pointer",
                          padding: "2px 4px",
                          fontSize: 14,
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* 日期區間：快選（全月/上中下旬）＋自訂起迄，右側即時比對去年同期與上月同區間 */}
                <div className="range-bar">
                  {[
                    { label: "全月", s: 1, e: 31 },
                    { label: "1-10", s: 1, e: 10 },
                    { label: "11-20", s: 11, e: 20 },
                    { label: `21-${daysInMonth}`, s: 21, e: 31 },
                  ].map((p) => {
                    const pEnd = Math.min(p.e, daysInMonth);
                    const isActive =
                      effRangeStart === p.s && effRangeEnd === pEnd;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        className={`tab-btn ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setRangeStart(p.s);
                          setRangeEnd(p.e);
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                  <div className="field-box">
                    <span>自訂</span>
                    <select
                      value={effRangeStart}
                      aria-label="區間起日"
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setRangeStart(v);
                        if (v > effRangeEnd) setRangeEnd(v);
                      }}
                    >
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                        (d) => (
                          <option key={d} value={d}>
                            {d}日
                          </option>
                        )
                      )}
                    </select>
                    <span>–</span>
                    <select
                      value={effRangeEnd}
                      aria-label="區間迄日"
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setRangeEnd(v);
                        if (v < effRangeStart) setRangeStart(v);
                      }}
                    >
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                        (d) => (
                          <option key={d} value={d}>
                            {d}日
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <div className="range-compare">
                    <div className="range-chip">
                      {effRangeStart}–{effRangeEnd}日 合計{" "}
                      <strong>{money(rangeTotals.total)}</strong>
                    </div>
                    <div className="range-chip">
                      去年同期 <strong>{money(rangeStats.lastYear)}</strong>
                      {rangeYoY !== null ? (
                        <span className={rangeYoY >= 0 ? "up" : "down"}>
                          {rangeYoY >= 0 ? "+" : ""}
                          {rangeYoY.toFixed(1)}%
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                    <div className="range-chip">
                      上月({rangeStats.prevMonthTab})同區間{" "}
                      <strong>{money(rangeStats.prevMonth)}</strong>
                      {rangeMoM !== null ? (
                        <span className={rangeMoM >= 0 ? "up" : "down"}>
                          {rangeMoM >= 0 ? "+" : ""}
                          {rangeMoM.toFixed(1)}%
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                    <div className="range-chip">
                      平日均 <strong>{money(dayTypeStats.avgWeekday)}</strong>
                      <span>({dayTypeStats.wdDays}天)</span>
                    </div>
                    <div className="range-chip">
                      週末均 <strong>{money(dayTypeStats.avgWeekend)}</strong>
                      <span>({dayTypeStats.weDays}天)</span>
                      {dayTypeStats.diffPct !== null && (
                        <span
                          className={dayTypeStats.diffPct >= 0 ? "up" : "down"}
                        >
                          {dayTypeStats.diffPct >= 0 ? "+" : ""}
                          {dayTypeStats.diffPct.toFixed(0)}% vs 平日
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {search && (
                  <div
                    style={{
                      marginBottom: 8,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      color: "var(--text-dim)",
                      fontWeight: 600,
                    }}
                  >
                    顯示 {filteredRows.length} / {daysInMonth} 天
                  </div>
                )}

                <div className="table-wrap">
                  <div className="table-scroll">
                    <table ref={tableRef}>
                      <thead>
                        <tr>
                          <th className="sticky-left">日期</th>
                          {FIXED_CHANNELS.map((ch) => (
                            <th
                              key={ch.key}
                              style={{ color: colorOf(ch.key, 0, theme) }}
                            >
                              {ch.label}
                            </th>
                          ))}
                          {monthData.dynamicChannels.map((key) => (
                            <th key={key}>{labelOf(key)}</th>
                          ))}
                          <th style={{ color: "var(--gold)" }}>小計</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRows.map((row) => {
                          const subtotal = currentChannels.reduce(
                            (sum, key) => sum + n(row[key]),
                            0
                          );
                          const flag = anomalyFlags[row.day];
                          const flagLabel =
                            flag === "spike"
                              ? "▲ 異常高"
                              : flag === "low"
                              ? "▼ 異常低"
                              : flag === "zero"
                              ? "○ 無營收"
                              : null;
                          return (
                            <tr
                              key={row.day}
                              className={flag ? `row-${flag}` : ""}
                            >
                              <td className="sticky-left">
                                {row.day}
                                <span
                                  className={`weekday-badge${
                                    dayWeekdayMap[row.day] === 0 ||
                                    dayWeekdayMap[row.day] === 6
                                      ? " weekend"
                                      : ""
                                  }`}
                                >
                                  {WEEKDAY_NAMES[dayWeekdayMap[row.day]]}
                                </span>
                                {flagLabel && (
                                  <span className={`anomaly-badge ${flag}`}>
                                    {flagLabel}
                                  </span>
                                )}
                              </td>
                              {FIXED_CHANNELS.map((ch) => (
                                <td key={ch.key}>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="cell-input"
                                    value={String(row[ch.key] ?? "")}
                                    aria-label={`${row.day}日 ${ch.label} 營收`}
                                    onChange={(e) =>
                                      setRowValue(
                                        row.day,
                                        ch.key,
                                        e.target.value
                                      )
                                    }
                                    onFocus={handleCellFocus}
                                    onKeyDown={handleCellKeyDown}
                                  />
                                </td>
                              ))}
                              {monthData.dynamicChannels.map((key) => (
                                <td key={key}>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    className="cell-input"
                                    value={String(row[key] ?? "")}
                                    aria-label={`${row.day}日 ${labelOf(
                                      key
                                    )} 營收`}
                                    onChange={(e) =>
                                      setRowValue(row.day, key, e.target.value)
                                    }
                                    onFocus={handleCellFocus}
                                    onKeyDown={handleCellKeyDown}
                                  />
                                </td>
                              ))}
                              <td
                                className={`subtotal ${
                                  subtotal > 100000
                                    ? "high"
                                    : subtotal > 0
                                    ? "mid"
                                    : "low"
                                }`}
                              >
                                {subtotal === 0 ? "—" : num(subtotal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="tfoot-row-upgraded">
                          <td className="tfoot-left upgraded">
                            <div className="tfoot-left-wrap">
                              <div className="tfoot-title">
                                {isFullRange
                                  ? "月總計"
                                  : `區間總計 ${effRangeStart}–${effRangeEnd}日`}
                              </div>
                              <div className="tfoot-sub">
                                {isFullRange
                                  ? "MONTHLY CLOSING"
                                  : "RANGE TOTAL"}
                              </div>
                            </div>
                          </td>
                          {FIXED_CHANNELS.map((ch) => (
                            <td
                              key={ch.key}
                              className="tfoot-right upgraded"
                              style={{ color: colorOf(ch.key, 0, theme) }}
                            >
                              <div className="tfoot-number">
                                {num(displayTotals[ch.key])}
                              </div>
                            </td>
                          ))}
                          {monthData.dynamicChannels.map((key) => (
                            <td key={key} className="tfoot-right upgraded">
                              <div className="tfoot-number muted">
                                {num(displayTotals[key])}
                              </div>
                            </td>
                          ))}
                          <td className="tfoot-right upgraded grand-total">
                            <div className="tfoot-total-label">
                              Total Revenue
                            </div>
                            <div className="tfoot-total-value">
                              {num(displayTotals.total)}
                            </div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="footer-note">
                  <Cloud size={13} color="var(--text-dim)" />
                  <span>
                    {cloudConnected
                      ? "Firebase 即時同步模式 · 本機備份已啟用"
                      : "尚未連上 Firebase · 本機資料模式"}
                  </span>
                  {syncState === "error" && (
                    <button
                      type="button"
                      className="btn-add"
                      style={{ marginLeft: 8, padding: "4px 10px" }}
                      onClick={() => {
                        setSyncState("idle");
                        setAuthReady(false);
                        setTimeout(() => setAuthReady(true), 100);
                      }}
                    >
                      重試同步
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
