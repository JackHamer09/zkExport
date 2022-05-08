<template>
  <div class="account-balances-export">
    <!-- Headline -->
    <h1 class="page-headline">Export Account Balances</h1>

    <!-- Main settings -->
    <Card>
      <template #header>
        <h3 class="card-section-headline">Required Information</h3>
      </template>
      <template #default>
        <dl>
          <template v-for="item in requiredFields" :key="item.prop">
            <Field :field="item" v-model="(values as any)[item.prop]" />
          </template>
        </dl>
        <CardAdvancedSettings :reset-button-visible="!areValuesDefault" @reset="accountBalances.resetValues">
          <template v-for="item in fields" :key="item.prop">
            <Field :field="item" v-model="(values as any)[item.prop]" />
          </template>
        </CardAdvancedSettings>
      </template>
      <template #footer>
        <Button
          class="ml-auto"
          size="md"
          :disabled="isRequestPending"
          :loading="isRequestPending"
          @click="accountBalances.searchWithSelectedSettings"
          @click.passive="logEvent('Fetch account balances clicked', values)"
        >
          <SearchIcon class="-ml-1 mr-2 h-5 w-5" />
          Fetch balances
        </Button>
      </template>
    </Card>

    <!-- Divider -->
    <UseQuickActions />

    <!-- Quick actions -->
    <QuickActions />

    <!-- Modals -->
    <Modal
      :value="isRequestPending"
      type="loading"
      :title="isTokensRequestPending ? 'Fetching tokens' : 'Fetching balances'"
    >
      <template #body>
        <template v-if="isTokensRequestPending">
          <b>{{ tokensCollection.length }}</b> tokens already fetched
        </template>
        <template v-else>
          <div>
            <b>{{ foundBalancesAmount }}</b> balances were saved
          </div>
        </template>
      </template>
    </Modal>
    <Modal
      v-if="foundBalancesAmount > 0"
      v-model:value="isRequestSuccessful"
      type="success"
      title="Fetching successful"
    >
      <template #body>
        <div>
          Total of <b>{{ foundBalancesAmount }}</b> tokens were saved
        </div>
        <DownloadAsSelect class="mt-4" />
      </template>
      <template #buttons>
        <Button @click="accountBalances.download" size="md" color="green" class="w-full">
          <DownloadIcon class="mr-1.5 h-5 w-5" />
          Download
        </Button>
        <Button outline class="mt-2 w-full" @click="isRequestSuccessful = false">Close</Button>
      </template>
    </Modal>
    <Modal v-else v-model:value="isRequestSuccessful" type="error" title="Fetching finished">
      <template #body>
        <div>
          There are no balances found.
          <br />If you think this is a mistake try changing search parameters and try again
        </div>
        <NetworkAlert class="mt-2" />
      </template>
      <template #buttons>
        <Button outline class="mt-2 w-full" @click="isRequestSuccessful = false">Close</Button>
      </template>
    </Modal>
    <Modal v-model:value="requestFailed" type="error" title="Fetching failed">
      <template #body>
        <div class="text-red-500" v-if="requestFail">{{ requestFail }}</div>
      </template>
      <template #buttons>
        <Button outline class="mt-2 w-full" @click="requestFail = false">Close</Button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { DownloadIcon, SearchIcon } from "@heroicons/vue/outline";
import Field from "@/components/common/Field.vue";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import UseQuickActions from "@/components/common/UseQuickActions.vue";
import NetworkAlert from "@/components/common/NetworkAlert.vue";
import Card from "@/components/common/Card.vue";
import CardAdvancedSettings from "@/components/common/CardAdvancedSettings.vue";
import DownloadAsSelect from "@/components/DownloadAsSelect.vue";
import QuickActions from "@/components/account/balances/QuickActions.vue";
import { logEvent } from "@/utils/logger";
import useTokens from "@/store/tokens";
import usePreferences from "@/store/preferences";
import useAccountBalances from "@/store/accountBalances";

const tokens = useTokens();
const preferences = usePreferences();
const { isRequestPending: isTokensRequestPending, tokens: tokensCollection } = storeToRefs(tokens);
const accountBalances = useAccountBalances();
const {
  isRequestPending,
  isRequestSuccessful,
  areValuesDefault,
  requestFail,
  values,
  requiredFields,
  fields,
  balances,
} = storeToRefs(accountBalances);

const requestFailed = computed({
  get: () => !!requestFail.value,
  set: (value: boolean) => {
    requestFail.value = value;
  },
});

const foundBalancesAmount = computed(() => Object.keys(balances.value).length);

onBeforeUnmount(() => preferences.setAddressEverywhere(values.value.address));
</script>
