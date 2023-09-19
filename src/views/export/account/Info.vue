<template>
  <div class="account-info-export">
    <!-- Headline -->
    <h1 class="page-headline">Export Account Info</h1>

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
        <CardAdvancedSettings :reset-button-visible="!areValuesDefault" @reset="accountInfo.resetValues">
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
          @click="accountInfo.searchWithSelectedSettings"
          @click.passive="logEvent('Fetch account info clicked', values)"
        >
          <SearchIcon class="-ml-1 mr-2 h-5 w-5" />
          Fetch account info
        </Button>
      </template>
    </Card>

    <!-- Divider -->
    <UseQuickActions />

    <!-- Quick actions -->
    <QuickActions />

    <Taxes />

    <!-- Modals -->
    <Modal :value="isRequestPending" type="loading" title="Fetching account">
      <template #body>
        <div>Fetching account is in progress...</div>
      </template>
    </Modal>
    <Modal v-model:value="isRequestSuccessful" type="success" title="Fetching successful">
      <template #body>
        <div>Account was successfully fetched</div>
        <DownloadAsSelect class="mt-4" />
      </template>
      <template #buttons>
        <Button @click="accountInfo.download" size="md" color="green" class="w-full">
          <DownloadIcon class="mr-1.5 h-5 w-5" />
          Download
        </Button>
        <Button outline class="mt-2 w-full" @click="isRequestSuccessful = false">Close</Button>
      </template>
    </Modal>
    <Modal v-model:value="requestFailed" type="error" title="Fetching failed">
      <template #body>
        <div class="text-red-500" v-if="requestFail">{{ requestFail }}</div>
        <NetworkAlert v-if="typeof requestFail === 'string' && requestFail.includes('wasn\'t found')" class="mt-2" />
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
import Taxes from "@/components/Taxes.vue";
import NetworkAlert from "@/components/common/NetworkAlert.vue";
import Card from "@/components/common/Card.vue";
import CardAdvancedSettings from "@/components/common/CardAdvancedSettings.vue";
import DownloadAsSelect from "@/components/DownloadAsSelect.vue";
import QuickActions from "@/components/account/info/QuickActions.vue";
import { logEvent } from "@/utils/logger";
import usePreferences from "@/store/preferences";
import useAccountInfo from "@/store/accountInfo";

const preferences = usePreferences();
const accountInfo = useAccountInfo();
const { isRequestPending, isRequestSuccessful, areValuesDefault, requestFail, values, requiredFields, fields } =
  storeToRefs(accountInfo);

const requestFailed = computed({
  get: () => !!requestFail.value,
  set: (value: boolean) => {
    requestFail.value = value;
  },
});

onBeforeUnmount(() => preferences.setAddressEverywhere(values.value.address));
</script>
