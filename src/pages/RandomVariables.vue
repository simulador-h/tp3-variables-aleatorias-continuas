<template>
  <q-page>
    <q-tabs
      v-model="activeTab"
      align="justify"
      active-color="primary" indicator-color="primary" class="text-grey"
    >
      <q-tab name="normal" label="Normal" />
      <q-tab name="exponential" label="Exponencial" />
      <q-tab name="poisson" label="Poisson" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <q-tab-panel name="normal">
        <normal-distribution-generator name="Normal" />
      </q-tab-panel>
      <q-tab-panel name="exponential">
        <exponential-distribution-generator name="Exponencial" />
      </q-tab-panel>
      <q-tab-panel name="poisson">
        <poisson-distribution-generator name="Poisson" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    toRefs,
  } from '@vue/composition-api';

  import NormalDistributionGenerator from 'components/NormalDistributionGenerator.vue';
  import ExponentialDistributionGenerator from 'components/ExponentialDistributionGenerator.vue';
  import PoissonDistributionGenerator from 'components/PoissonDistributionGenerator.vue';

  function useRandomVariables() {
    const state = reactive({
      activeTab: 'normal',
    });

    return toRefs(state);
  }

  export default defineComponent({
    name: 'RandomVariables',
    components: { NormalDistributionGenerator, ExponentialDistributionGenerator, PoissonDistributionGenerator },
    setup() {
      return useRandomVariables();
    },
  });
</script>
