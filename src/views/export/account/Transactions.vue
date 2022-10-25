<template>
  <div class="account-transactions-export">
    <!-- Headline -->
    <h1 class="page-headline">Export Account Transactions</h1>
    <p v-if="meta?.description" class="sr-only">{{ meta.description }}</p>

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
        <CardAdvancedSettings :reset-button-visible="!areValuesDefault" @reset="accountTransactions.resetValues">
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
          @click="accountTransactions.searchWithSelectedSettings"
          @click.passive="logEvent('Fetch account transactions clicked', values)"
        >
          <SearchIcon class="-ml-1 mr-2 h-5 w-5" />
          Fetch transactions
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
      :title="
        isTokensRequestPending ? 'Fetching tokens' : !askToStop ? 'Fetching transactions' : 'Stopping fetching process'
      "
    >
      <template #body>
        <template v-if="isTokensRequestPending">
          <b>{{ tokensCollection.length }}</b> tokens already fetched
        </template>
        <template v-else>
          <div>
            <b>{{ txList.length }}</b>
            {{ searchValues.finishAt?.key === "limit" ? `/${searchValues.max}` : "" }} transactions were saved
          </div>
        </template>
      </template>
      <template #buttons>
        <Button
          @click="stop"
          :disabled="askToStop"
          outline
          size="md"
          color="yellow"
          class="w-full"
          @click.passive="logEvent('Stop fetch account transactions clicked', searchValues)"
        >
          <StopIcon class="mr-1.5 h-5 w-5" />
          Stop
        </Button>
      </template>
    </Modal>
    <Modal
      v-if="txList.length > 0"
      v-model:value="isRequestSuccessful"
      :type="askToStop ? 'stop' : 'success'"
      :title="askToStop ? 'Fetching stopped' : 'Fetching successful'"
    >
      <template #body>
        <div>
          Total of <b>{{ txList.length }}</b> transactions were saved
        </div>
        <DownloadAsSelect class="mt-4" />
      </template>
      <template #buttons>
        <Button @click="accountTransactions.download" size="md" color="green" class="w-full">
          <DownloadIcon class="mr-1.5 h-5 w-5" />
          Download
        </Button>
        <Button outline class="mt-2 w-full" @click="isRequestSuccessful = false">Close</Button>
      </template>
    </Modal>
    <Modal v-else v-model:value="isRequestSuccessful" type="error" title="Fetching finished">
      <template #body>
        <template v-if="askToStop">The fetching process was stopped. No valid transactions were find yet.</template>
        <template v-else>
          <div>
            There were no transactions found.
            <br />If you think this is a mistake try changing search parameters and try again
          </div>
          <NetworkAlert class="mt-2" />
        </template>
      </template>
      <template #buttons>
        <Button outline class="mt-2 w-full" @click="isRequestSuccessful = false">Close</Button>
      </template>
    </Modal>
    <Modal v-model:value="requestFailed" type="error" title="Fetching failed">
      <template #body>
        <div class="text-red-500" v-if="requestFail">{{ requestFail }}</div>
        <template v-if="txList.length > 0">
          <div class="mt-2">
            Only <b>{{ txList.length }}</b> transactions were fetched and saved successfully. If you wish you can still
            download them.
          </div>
          <DownloadAsSelect class="mt-4" />
        </template>
      </template>
      <template #buttons>
        <Button v-if="txList.length > 0" @click="accountTransactions.download" size="md" color="red" class="w-full">
          <DownloadIcon class="mr-1.5 h-5 w-5" />
          Download
        </Button>
        <Button outline class="mt-2 w-full" @click="requestFail = false">Close</Button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { DownloadIcon, StopIcon, SearchIcon } from "@heroicons/vue/outline";
import Field from "@/components/common/Field.vue";
import Button from "@/components/common/Button.vue";
import Modal from "@/components/common/Modal.vue";
import UseQuickActions from "@/components/common/UseQuickActions.vue";
import NetworkAlert from "@/components/common/NetworkAlert.vue";
import Card from "@/components/common/Card.vue";
import CardAdvancedSettings from "@/components/common/CardAdvancedSettings.vue";
import DownloadAsSelect from "@/components/DownloadAsSelect.vue";
import QuickActions from "@/components/account/transactions/QuickActions.vue";
import { logEvent } from "@/utils/logger";
import useTokens from "@/store/tokens";
import usePreferences from "@/store/preferences";
import useAccountTransactions from "@/store/accountTransactions";
import { useRoute } from "vue-router";

const { meta } = useRoute();
const tokens = useTokens();
const preferences = usePreferences();
const { isRequestPending: isTokensRequestPending, tokens: tokensCollection } = storeToRefs(tokens);
const accountTransactions = useAccountTransactions();
const {
  isRequestPending,
  isRequestSuccessful,
  areValuesDefault,
  requestFail,
  values,
  searchValues,
  requiredFields,
  fields,
  txList,
  askToStop,
} = storeToRefs(accountTransactions);

const requestFailed = computed({
  get: () => !!requestFail.value,
  set: (value: boolean) => {
    requestFail.value = value;
  },
});

function stop() {
  askToStop.value = true;
}

onBeforeUnmount(() => preferences.setAddressEverywhere(values.value.address));
</script>
