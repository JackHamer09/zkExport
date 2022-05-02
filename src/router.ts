import { createRouter, createWebHistory } from "vue-router";
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
      description: "Export transaction history of an address",
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
      description: "Export balances of an address",
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
      description: "Export NFTs of an address",
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
      description: "Export account information",
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
      description: "Export block transactions",
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
      description: "Export block information",
      icon: CubeIcon,
      title: "Export zkSync block information",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...defaultRoutes, ...accountRoutes, ...blockRoutes],
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | zkExport`;
  next();
});

export default router;
