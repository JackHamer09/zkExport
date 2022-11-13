import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";
import {
  ChartBarIcon,
  UserIcon,
  CurrencyDollarIcon,
  PhotographIcon,
  ChartSquareBarIcon,
  CubeIcon,
} from "@heroicons/vue/outline";
import Index from "@/views/Index.vue";
import ExportAccountTransactions from "@/views/export/account/Transactions.vue";
import ExportAccountBalances from "@/views/export/account/Balances.vue";
import ExportAccountNFTs from "@/views/export/account/NFTs.vue";
import ExportAccountInfo from "@/views/export/account/Info.vue";
import ExportBlockTransactions from "@/views/export/block/Transactions.vue";
import ExportBlockInfo from "@/views/export/block/Info.vue";

const defaultRoutes = [
  {
    path: "/",
    name: "home",
    component: Index,
    meta: {
      title: "Export zkSync transactions to CSV, XLS and more",
      description: "Export zkSync transactions or account balances to CSV, XLS and other table formats",
    },
  },
];

export const accountRoutes = [
  {
    path: "/export/account/transactions",
    name: "export-account-transactions",
    component: ExportAccountTransactions,
    meta: {
      label: "Account Transactions",
      description: "Export transaction history of an account to CSV, XLS and other table formats",
      icon: ChartBarIcon,
      title: "Export zkSync account transactions",
    },
  },
  {
    path: "/export/account/balances",
    name: "export-account-balances",
    component: ExportAccountBalances,
    meta: {
      label: "Account Balances",
      description: "Export balances of an account to CSV, XLS and other table formats",
      icon: CurrencyDollarIcon,
      title: "Export zkSync account balances",
    },
  },
  {
    path: "/export/account/nfts",
    name: "export-account-nfts",
    component: ExportAccountNFTs,
    meta: {
      label: "Account NFTs",
      description: "Export NFTs of an account to CSV, XLS and other table formats",
      icon: PhotographIcon,
      title: "Export zkSync account NFTs",
    },
  },
  {
    path: "/export/account/info",
    name: "export-account-info",
    component: ExportAccountInfo,
    meta: {
      label: "Account Info",
      description: "Export account information to CSV, XLS and other table formats",
      icon: UserIcon,
      title: "Export zkSync account information",
    },
  },
];
export const blockRoutes = [
  {
    path: "/export/block/transactions",
    name: "export-block-transactions",
    component: ExportBlockTransactions,
    meta: {
      label: "Block Transactions",
      description: "Export block transactions to CSV, XLS and other table formats",
      icon: ChartSquareBarIcon,
      title: "Export zkSync block transactions",
    },
  },
  {
    path: "/export/block/info",
    name: "export-block-info",
    component: ExportBlockInfo,
    meta: {
      label: "Block Info",
      description: "Export block information to CSV, XLS and other table formats",
      icon: CubeIcon,
      title: "Export zkSync block information",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...defaultRoutes, ...accountRoutes, ...blockRoutes],
});

function replaceMeta(type: "name" | "property", key: string, value: unknown, fallbackValue: string) {
  document.querySelector(`meta[${type}="${key}"]`)?.setAttribute("content", (value ?? fallbackValue) as string);
}

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | zkExport`;
  replaceMeta("name", "description", to.meta.description, defaultRoutes[0].meta.description);
  replaceMeta("property", "og:url", to.path, to.path);
  replaceMeta("property", "og:title", to.meta.title, defaultRoutes[0].meta.title);
  replaceMeta("property", "og:image:alt", to.meta.title, defaultRoutes[0].meta.title);
  replaceMeta("property", "og:description", to.meta.description, defaultRoutes[0].meta.description);
  replaceMeta("name", "twitter:image:alt", to.meta.title, defaultRoutes[0].meta.title);
  replaceMeta("name", "twitter:title", to.meta.title, defaultRoutes[0].meta.title);
  replaceMeta("name", "twitter:description", to.meta.description, defaultRoutes[0].meta.description);
  next();
});

trackRouter(router);

export default router;
