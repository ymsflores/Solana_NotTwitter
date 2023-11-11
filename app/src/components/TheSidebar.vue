<script setup>
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import { useWorkspace } from "@/composables";
const { wallet } = useWorkspace();
const { connected } = useWallet();

function gotoGoogle() {
  window.open(
    "https://explorer.solana.com/address/" +
      String(wallet.value.publicKey.toBase58()) +
      "?cluster=devnet"
  );
}
</script>

<template>
  <aside
    class="flex flex-col items-center md:items-stretch space-y-2 md:space-y-4"
  >
    <div class="flex flex-col items-center md:items-stretch space-y-2">
      <router-link
        :to="{ name: 'Home' }"
        class="rounded-full hover:bg-gray-100 p-3 md:w-full inline-flex items-center space-x-4"
        active-class="font-bold"
        v-slot="{}"
      >
        <div class="text-xl hidden md:block">Home</div>
      </router-link>
      <router-link
        v-if="connected"
        :to="{ name: 'Profile' }"
        class="rounded-full hover:bg-gray-100 p-3 md:w-full inline-flex items-center space-x-4"
        active-class="font-bold"
        v-slot="{}"
      >
        <div class="text-xl hidden md:block">Profile</div>
      </router-link>
    </div>
    <div class="fixed bottom-8 right-8 md:static w-48 md:w-full">
      <wallet-multi-button></wallet-multi-button>
    </div>
    <div class="fixed bottom-8 right-8 md:static w-48 md:w-full">
      <button
        v-if="connected"
        @click="gotoGoogle()"
        class="swv-button swv-button-trigger"
        aria-expanded="false"
        title="Transaction History"
        style="pointer-events: auto"
      >
        <p>Transactions</p>
      </button>
    </div>
  </aside>
</template>
